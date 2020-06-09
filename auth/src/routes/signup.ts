import express, { Request, Response } from "express";
import {
    body,
    validationResult,
    ValidationError,
    Result,
} from "express-validator";
import { RequestValidationError } from "../errors/request-validation-errors";
import { DatabaseConnectionError } from "../errors/database-connection-error";

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
    (req: Request, res: Response) => {
        // handle erros coming from validator, if any
        const errors: Result<ValidationError> = validationResult(req);

        if (!errors.isEmpty()) {
            // need to call array() methods to error object (of type Result<ValidationError>) first
            // to convert errors into ValidationError[] type
            throw new RequestValidationError(errors.array());
        }

        // if user input passes the validation, extract the email & passwrod from req body
        const { email, password } = req.body;

        console.log("Creating a user...");
        throw new DatabaseConnectionError();

        res.send({});
    }
);

export { router as signupRouter };
