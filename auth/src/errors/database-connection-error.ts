export class DatabaseConnectionError extends Error {
    statusCode = 500;
    private reason = "Error connecting to database";

    constructor() {
        super();

        // Only do this because we are extending a built in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeErrors() {
        return [
            {
                message: this.reason,
            },
        ];
    }
}
