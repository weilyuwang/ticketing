import express, { Request, Response } from "express";
import {
    requireAuthMiddleware,
    validateRequestMiddleware,
} from "@wwticketing/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
    "/api/tickets",
    requireAuthMiddleware,
    [
        body("title").not().isEmpty().withMessage("Title is required"),
        body("price")
            .isFloat({ gt: 0 })
            .withMessage("Price must be greater than 0"),
    ],
    validateRequestMiddleware,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;

        const ticket = Ticket.build({
            title,
            price,
            userId: req.currentUser!.id,
        });

        // save ticket to database
        await ticket.save();

        // publish ticket create event/message to NATS Streaming server
        await new TicketCreatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
        });

        res.status(201).send(ticket);
    }
);

export { router as createTicketRouter };
