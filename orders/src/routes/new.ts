import express, { Request, Response } from "express";
import {
    requireAuthMiddleware,
    validateRequestMiddleware,
    NotFoundError,
    OrderStatus,
    BadRequestError,
} from "@wwticketing/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

const router = express.Router();

router.post(
    "/api/orders",
    requireAuthMiddleware,
    [
        body("ticketId")
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage("TicketId must be provided"),
    ],
    validateRequestMiddleware,
    async (req: Request, res: Response) => {
        const { ticketId } = req.body;

        // 1)
        // Find the ticket the user is trying to order in the database
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            throw new NotFoundError();
        }

        // 2)
        // Make sure that this ticket is not already reserved
        // Run query to look at all orders. Find an order where the ticket
        // is the ticket we just found *and* the order status is not cancelled
        // If we find an order from that means the ticket *is* reserved
        const existingOrder = await Order.findOne({
            ticket: ticket,
            status: {
                $in: [
                    OrderStatus.Created,
                    OrderStatus.AwaitingPayment,
                    OrderStatus.Complete,
                ],
            },
        });

        if (existingOrder) {
            throw new BadRequestError("Ticket is already reserved");
        }

        // 3)
        // Calculate an expiration date for this order

        // 4)
        // Build the order and save it to database

        // 5)
        // Publish an event saying that an order was created

        res.send({});
    }
);

export { router as newOrderRouter };
