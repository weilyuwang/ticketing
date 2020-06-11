import { CustomError, ErrorMessage } from "./custom-error";

export class NotAuthorizedError extends CustomError {
    statusCode: number = 401; // forbidden

    constructor() {
        super("Not Authorized");

        // Only do this because we are extending a built in class
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    serializeErrors(): ErrorMessage[] {
        return [{ message: "Not Authorized" }];
    }
}
