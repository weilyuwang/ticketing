import express, { Request, Response } from "express";
import {
    requireAuthMiddleware,
    NotFoundError,
    NotAuthorizedError,
} from "@wwticketing/common";
import { Order, OrderStatus } from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";

const router = express.Router();

// We are only actually `deleting` an order, but instead set Order Status to `Cancelled`
// `patch` HTTP Method might be more suitable for this case
router.delete(
    "/api/orders/:orderId",
    requireAuthMiddleware,
    async (req: Request, res: Response) => {
        const { orderId } = req.params;

        const order = await Order.findById(orderId).populate("ticket");

        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        order.status = OrderStatus.Cancelled;
        await order.save();

        // Publishing an event saying that the order is cancelled
        new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            ticket: {
                id: order.ticket.id,
            },
        });

        res.status(204).send(order);
    }
);

export { router as deleteOrderRouter };
