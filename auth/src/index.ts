import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";

import { errorHandler } from "./middlewares/error-handler";

import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.set("trust proxy", true); // trust ingress & nginx proxy
app.use(json());
app.use(
    cookieSession({
        signed: false, // disable encryption on the cookie - JWT is already secured
        secure: true, // HTTPS connection only
    })
);

// express routes
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// use express-async-errors lib behind the scene to handle async errors
app.all("*", async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
    // First check if JWT_KEY is defined
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined");
    }

    try {
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log(err);
    }

    app.listen(3000, () => {
        console.log("Auth Service listening on port 3000");
    });
};

start();
