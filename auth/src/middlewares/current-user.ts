import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
    id: string;
    email: string;
}

// Augment type definition
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}

export const currentUserMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // first check if jwt exists
    if (!req.session?.jwt) {
        return next();
    }

    // then check if jwt is valid
    try {
        const payload = jwt.verify(
            req.session.jwt,
            process.env.JWT_KEY!
        ) as UserPayload;

        // append another property to the request object : currentUser
        req.currentUser = payload;
    } catch (err) {}

    next();
};
