import express from "express";
import { currentUserMiddleware } from "@wwticketing/common";

const router = express.Router();

router.get("/api/users/currentuser", currentUserMiddleware, (req, res) => {
    res.send({ currentUser: req.currentUser || null });
    // send { currentUser: user_info_payload } or send { currentUser: null }
});

export { router as currentUserRouter };
