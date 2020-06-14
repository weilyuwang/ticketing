import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
    BadRequestError,
    validateRequestMiddleware,
} from "@wwticketing/common";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { Password } from "../services/password";

const router = express.Router();

router.post(
    "/api/users/signin",
    [
        body("email").isEmail().withMessage("Email must be valid"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("You must supply a password"),
    ],
    validateRequestMiddleware,
    async (req: Request, res: Response) => {
        // extract email and password info from request body
        const { email, password } = req.body;

        // first check if the email has been registered
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new BadRequestError("Invalid credentials");
        }

        // then compare passwords
        const passwordsMatch = await Password.compare(
            existingUser.password,
            password
        );
        if (!passwordsMatch) {
            throw new BadRequestError("Invalid credentials");
        }

        // if credentials are correctly matched

        // Generate a new JWT to user
        const userJwt = jwt.sign(
            {
                id: existingUser.id,
                email: existingUser.email,
            },
            process.env.JWT_KEY!
        );

        // Store the JWT on session object
        req.session = {
            jwt: userJwt,
        };

        res.status(200).send(existingUser);
    }
);

export { router as signinRouter };
