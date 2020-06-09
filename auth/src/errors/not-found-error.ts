import { CustomError, ErrorMessage } from "./custom-error";

export class NotFoundError extends CustomError {
    statusCode: number = 404;

    constructor() {
        super("Route not found");

        // Only do this because we are extending a built in class
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors(): ErrorMessage[] {
        return [
            {
                message: "404 Not Found",
            },
        ];
    }
}
