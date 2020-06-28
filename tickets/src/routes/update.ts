import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
    validateRequestMiddleware,
    requireAuthMiddleware,
    NotFoundError,
    NotAuthorizedError,
    BadRequestError,
} from "@wwticketing/common";
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
    "/api/tickets/:id",
    requireAuthMiddleware,
    [
        body("title").not().isEmpty().withMessage("Title is required"),
        body("price")
            .isFloat({ gt: 0 })
            .withMessage("Price must be provided and must be greater than 0"),
    ],
    validateRequestMiddleware,
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            throw new NotFoundError();
        }

        // if the ticket is locked (has orderId property)
        if (ticket.orderId) {
            throw new BadRequestError('Cannot edit a reserved ticket')
        }

        // to update the ticket, the user must be the author of the ticket
        if (ticket.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        ticket.set({
            title: req.body.title,
            price: req.body.price,
        });

        await ticket.save();

        // publish ticket updated event/message to NATS Streaming server
        new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
        });

        res.send(ticket);
    }
);

export { router as updateTicketRouter };
