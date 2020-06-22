import express, { Request, Response } from "express";
import {
    requireAuthMiddleware,
    validateRequestMiddleware,
} from "@wwticketing/common";
import { body } from "express-validator";
import mongoose from "mongoose";

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
        res.send({});
    }
);

export { router as newOrderRouter };
