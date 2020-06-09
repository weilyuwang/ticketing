import { CustomError, ErrorMessage } from "./custom-error";

export class BadRequestError extends CustomError {
    statusCode: number = 400;

    constructor(public message: string) {
        super(message);

        // Only do this because we are extending a built in class
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors(): ErrorMessage[] {
        return [{ message: this.message }];
    }
}
