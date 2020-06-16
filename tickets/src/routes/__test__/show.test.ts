import request from "supertest";
import { app } from "../../app";

it("returns a 404 if the ticket is not found", async () => {
    await request(app)
        .get("/api/tickets/must_not_exist_id") // id passed in must be a single String of 12 bytes or a string of 24 hex characters
        .send()
        .expect(404);
});

it("returns the ticket if the ticket is found", async () => {
    const title = "concert";
    const price = 50;

    // sign in and create a ticket first
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin_and_get_cookie())
        .send({ title, price })
        .expect(201);

    // then test if the ticket info can be found
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
});
