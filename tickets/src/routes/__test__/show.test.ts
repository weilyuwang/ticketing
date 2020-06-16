import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns a 404 if the ticket is not found", async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString();

    await request(app).get(`/api/tickets/${ticketId}`).send().expect(404);
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
