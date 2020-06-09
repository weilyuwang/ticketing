import { ValidationError } from "express-validator";

// extends base class Error
export class RequestValidationError extends Error {
    constructor(public errors: ValidationError[]) {
        super();

        // Only do this because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
}
