import request from "supertest";
import { app } from "../../app";

it("returns a status code 201 on successful signup", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "test_password",
        })
        .expect(201);
});
