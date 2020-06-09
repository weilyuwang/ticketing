import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

// extends base class Error
export class RequestValidationError extends CustomError {
    statusCode = 400;

    constructor(private errors: ValidationError[]) {
        super("Invalid request parameters");

        // Only do this because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors(): { message: string; field?: string }[] {
        return this.errors.map((error: ValidationError) => {
            return { message: error.msg, field: error.param };
        });
    }
}
