import { CustomError, ErrorMessage } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
    statusCode = 500;
    private reason = "Error connecting to database";

    constructor() {
        super("Error connecting to db");

        // Only do this because we are extending a built in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeErrors(): ErrorMessage[] {
        return [
            {
                message: this.reason,
            },
        ];
    }
}
