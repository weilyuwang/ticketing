import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
    validateRequestMiddleware,
    requireAuthMiddleware,
    NotFoundError,
    NotAuthorizedError,
} from "@wwticketing/common";
import { Ticket } from "../models/ticket";

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

        // to update the ticket, the user must be the author of the ticket
        if (ticket.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        ticket.set({
            title: req.body.title,
            price: req.body.price,
        });

        await ticket.save();

        res.send(ticket);
    }
);

export { router as updateTicketRouter };
