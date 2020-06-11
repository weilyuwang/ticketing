import request from "supertest";
import { app } from "../../app";

const TEST_EMAIL = "test@test.com";
const TEST_PASSWORD = "password";

it("responds with details with the current user", async () => {
    // first signup to register a user
    const signupResponse = await request(app)
        .post("/api/users/signup")
        .send({
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
        })
        .expect(201);

    const cookie = signupResponse.get("Set-Cookie");

    // console.log(cookie);

    const response = await request(app)
        .get("/api/users/currentuser")
        .set("Cookie", cookie)
        .send()
        .expect(200);

    expect(response.body.currentUser.email).toEqual(TEST_EMAIL);
});
