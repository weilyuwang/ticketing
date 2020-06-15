import express, { Request, Response } from "express";
import { requireAuthMiddleware } from "@wwticketing/common";

const router = express.Router();

router.post(
    "/api/tickets",
    requireAuthMiddleware,
    (req: Request, res: Response) => {
        res.sendStatus(200);
    }
);

export { router as createTicketRouter };
