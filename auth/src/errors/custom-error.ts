export abstract class CustomError extends Error {
    // required field of type number
    abstract statusCode: number;

    constructor(message: string) {
        super(message);

        // Only do this because we are extending a built in class
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    // required methods (signatures)
    abstract serializeErrors(): { message: string; field?: string }[]; // field is option (?)
}
