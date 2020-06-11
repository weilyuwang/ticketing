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

it("returns a 400 with missing email and password", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({ email: "validemail@gmail.com" })
        .expect(400);

    await request(app)
        .post("/api/users/signup")
        .send({ password: "validpassword" })
        .expect(400);

    await request(app).post("/api/users/signup").send({}).expect(400);
});

it("disallows duplicate emails", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "valid@gmail.com",
            password: "validpass",
        })
        .expect(201);

    await request(app)
        .post("/api/users/signup")
        .send({
            email: "valid@gmail.com",
            password: "validpass",
        })
        .expect(400);
});

it("sets a cookie after successful signup", async () => {
    const response = await request(app)
        .post("/api/users/signup")
        .send({
            email: "valid@gmail.com",
            password: "validpass",
        })
        .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined(); // test set-cookie header is defined
});
