import express, { Request, Response } from "express";
import {
    requireAuthMiddleware,
    NotFoundError,
    NotAuthorizedError,
} from "@wwticketing/common";
import { Order, OrderStatus } from "../models/order";

const router = express.Router();

// We are only actually `deleting` an order, but instead set Order Status to `Cancelled`
// `patch` HTTP Method might be more suitable for this case
router.delete(
    "/api/orders/:orderId",
    requireAuthMiddleware,
    async (req: Request, res: Response) => {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        order.status = OrderStatus.Cancelled;
        await order.save();

        // TODO: Publishing an event saying that the order is cancelled

        res.status(204).send(order);
    }
);

export { router as deleteOrderRouter };
