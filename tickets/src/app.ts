import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandlerMiddleware, NotFoundError } from "@wwticketing/common";

import { createTicketRouter } from "./routes/new";

const app = express();
app.set("trust proxy", true); // trust ingress & nginx proxy
app.use(json());
app.use(
    cookieSession({
        signed: false, // disable encryption on the cookie - JWT is already secured
        secure: process.env.NODE_ENV !== "test", // *** HTTPS connection only ***, but exception made for testing
    })
);

// express routes
app.use(createTicketRouter);

// use express-async-errors lib behind the scene to handle async errors
app.all("*", async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandlerMiddleware);

export { app };
