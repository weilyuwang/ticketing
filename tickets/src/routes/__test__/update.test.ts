import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from '../../models/ticket'
import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if the provided id does no exist", async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${ticketId}`)
        .set("Cookie", global.signin_and_get_cookie())
        .send({ title: "updated_title", price: 20 })
        .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${ticketId}`)
        .send({ title: "updated_title", price: 20 })
        .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
    // everytime signin_and_get_cookie() is called, a new user id is generated
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin_and_get_cookie())
        .send({ title: "some_title", price: 100 });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", global.signin_and_get_cookie())
        .send({ title: "update_title", price: 80 })
        .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
    const cookie: string[] = global.signin_and_get_cookie();

    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({ title: "some_title", price: 100 })
        .expect(201);

    // use the same cookie => same user
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({ title: "", price: 80 })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({ title: "valid_title", price: -100 })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({ price: 80 })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({})
        .expect(400);
});

it("udpates the ticket provided valid inputs", async () => {
    const cookie: string[] = global.signin_and_get_cookie();

    // user creates a new ticket
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({ title: "some_title", price: 100 })
        .expect(201); //CREATED

    // update the ticket by the same user
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({ title: "updated_title", price: 80 })
        .expect(200); //UPDATE SUCCESSFULLY

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual("updated_title");
    expect(ticketResponse.body.price).toEqual(80);
});

it("publishes an event", async () => {
    const cookie: string[] = global.signin_and_get_cookie();

    // user creates a new ticket
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({ title: "some_title", price: 100 })
        .expect(201); //CREATED

    // update the ticket by the same user
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({ title: "updated_title", price: 80 })
        .expect(200); //UPDATE SUCCESSFULLY

    // test if an event has been published
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});


it('rejects updates if the ticket is reserved', async () => {
    const cookie: string[] = global.signin_and_get_cookie();

    // user creates a new ticket
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({ title: "some_title", price: 100 })
        .expect(201); //CREATED

    const ticket = await Ticket.findById(response.body.id)
    // mock ticket reservation: add orderId property to ticket document
    ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() })
    await ticket!.save()

    // try to update the reserved ticket 
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({ title: "updated_title", price: 80 })
        .expect(400); // BAD REQUEST : ticket already reserved
})