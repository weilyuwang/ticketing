import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "test_password",
        })
        .expect(201);
});

it("returns a 400 with an invalid email", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "invalidemail.com",
            password: "test_password",
        })
        .expect(400);
});

it("returns a 400 with an invalid password", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "invalidemail.com",
            password: "1",
        })
        .expect(400);
});
