import request from "supertest";
import { app } from "../../app";

it("responds with details with the current user", async () => {
    const cookie = await global.signup_and_get_cookie();

    const response = await request(app)
        .get("/api/users/currentuser")
        .set("Cookie", cookie)
        .send()
        .expect(200);

    expect(response.body.currentUser.email).toEqual("test@test.com");
});
