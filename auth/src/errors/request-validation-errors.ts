import { ValidationError } from "express-validator";

// extends base class Error
export class RequestValidationError extends Error {
    statusCode = 400;

    constructor(private errors: ValidationError[]) {
        super();

        // Only do this because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map((error) => {
            return { message: error.msg, field: error.param };
        });
    }
}
