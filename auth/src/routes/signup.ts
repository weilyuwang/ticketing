import express, { Request, Response } from "express";
import { User } from "../models/user";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import {
    BadRequestError,
    validateRequestMiddleware,
} from "@wwticketing/common";

const router = express.Router();

router.post(
    "/api/users/signup",
    [
        body("email").isEmail().withMessage("Email must be valid"),
        body("password")
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage("Password must be between 4 and 20 characters"),
    ],
    validateRequestMiddleware,
    async (req: Request, res: Response) => {
        // extract email and password info from request body
        const { email, password } = req.body;

        // first check if the email has been registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new BadRequestError("Email already in use");
        }

        // Create new user and persist it into MongoDB
        const user = User.build({ email, password });
        await user.save();

        // Generate JWT
        const userJwt = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.JWT_KEY!
        );

        // Store it on session object
        req.session = {
            jwt: userJwt,
        };

        res.status(201).send(user);
    }
);

export { router as signupRouter };
