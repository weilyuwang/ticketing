import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
    errorHandlerMiddleware,
    NotFoundError,
    currentUserMiddleware,
} from "@wwticketing/common";

import { deleteOrderRouter } from "./routes/delete";
import { indexOrderRouter } from "./routes/index";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";

const app = express();
app.set("trust proxy", true); // trust ingress & nginx proxy
app.use(json());

// use cookieSession to add session property to req object
app.use(
    cookieSession({
        signed: false, // disable encryption on the cookie - JWT is already secured
        // secure: process.env.NODE_ENV !== "test", // *** HTTPS connection only ***, but exception made for testing
        secure: false,
    })
);

// middleware to add currentUser to req
app.use(currentUserMiddleware);

// express routes
app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

// use express-async-errors lib behind the scene to handle async errors
app.all("*", async (req, res) => {
    throw new NotFoundError();
});

// middleware to handle all kinds of errors
app.use(errorHandlerMiddleware);

export { app };
