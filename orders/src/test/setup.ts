import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
    namespace NodeJS {
        interface Global {
            signin_and_get_cookie(): string[];
        }
    }
}

// use jest to mock the nats-wrapper
// jest will automatically use the fake nats-wrapper inside __mock__ folder
jest.mock("../nats-wrapper");

// declare in-memory mock mongo server
let mongo: any;

beforeAll(async () => {
    process.env.JWT_KEY = "test_jwt_key";
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

beforeEach(async () => {
    jest.clearAllMocks();
    // get all existing collections in mongodb
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

// global function only for test environment
// signup and return the cookie from the response
global.signin_and_get_cookie = () => {
    // Build a JWT payload. {id, email}
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: "test@test.com",
    };

    // Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session object. {jwt: MY_JWT}
    const session = { jwt: token };

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take that JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString("base64");

    // Return a string thats the cookie with the encoded data
    const cookie_base64 = `express:sess=${base64}`;

    return [cookie_base64]; // a little gottcha: put the cookie string inside an array to make supertest lib happy :)
};
