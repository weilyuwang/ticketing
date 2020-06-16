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
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            throw new NotFoundError();
        }

        // to update the ticket, the user must be the author of the ticket
        if (ticket.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        res.send(ticket);
    }
);

export { router as updateTicketRouter };
