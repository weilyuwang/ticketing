import express, { Request, Response } from "express";
import {
    requireAuthMiddleware,
    validateRequestMiddleware,
} from "@wwticketing/common";
import { body } from "express-validator";

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
    (req: Request, res: Response) => {
        res.sendStatus(200);
    }
);

export { router as createTicketRouter };
