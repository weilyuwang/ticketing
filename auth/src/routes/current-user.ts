import express from "express";
import { currentUserMiddleware } from "../middlewares/current-user";
import { requireAuthMiddleware } from "../middlewares/require-auth";

const router = express.Router();

router.get(
    "/api/users/currentuser",
    currentUserMiddleware,
    requireAuthMiddleware,
    (req, res) => {
        res.send({ currentUser: req.currentUser || null });
        // send { currentUser: user_info_payload } or send { currentUser: null }
    }
);

export { router as currentUserRouter };
