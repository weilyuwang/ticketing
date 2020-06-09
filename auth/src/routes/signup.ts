import express, { Request, Response } from "express";
import { User } from "../models/user";
import {
    body,
    validationResult,
    ValidationError,
    Result,
} from "express-validator";
import { RequestValidationError } from "../errors/request-validation-errors";

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
    async (req: Request, res: Response) => {
        // handle erros coming from validator, if any
        const errors: Result<ValidationError> = validationResult(req);

        if (!errors.isEmpty()) {
            // need to call array() methods to error object (of type Result<ValidationError>) first
            // to convert errors into ValidationError[] type
            throw new RequestValidationError(errors.array());
        }

        const { email, password } = req.body;

        // first check if the email has been registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Email already in use");
            res.send({});
            return;
        }

        // Create new user and persist it into MongoDB
        const user = User.build({ email, password });
        await user.save();

        res.status(201).send(user);
    }
);

export { router as signupRouter };
