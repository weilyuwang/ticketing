import request from "supertest";
import { app } from "../../app";

it("fails when a email that does no exist is supplied", async () => {
    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "password",
        })
        .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
    // first signup to register a user
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password",
        })
        .expect(201);

    // then signin with an incorrect password
    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "incorrect_password",
        })
        .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
    // first signup to register a user
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password",
        })
        .expect(201);

    // then signin with an incorrect password
    const response = await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "password",
        })
        .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
});
