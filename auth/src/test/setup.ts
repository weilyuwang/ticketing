import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";

declare global {
    namespace NodeJS {
        interface Global {
            signup_and_get_cookie(): Promise<string[]>;
        }
    }
}

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
global.signup_and_get_cookie = async () => {
    const email = "test@test.com";
    const password = "password";

    const response = await request(app)
        .post("/api/users/signup")
        .send({ email, password })
        .expect(201);

    const cookie = response.get("Set-Cookie");

    return cookie;
};
