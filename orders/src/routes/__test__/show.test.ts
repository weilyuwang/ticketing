import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from 'mongoose'

it("fetches the order", async () => {
    // Create a ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20,
    });

    await ticket.save();

    // Create a mock user
    const user = global.signin_and_get_cookie();

    // Make request to build an order with this ticket
    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // Make request to fetch the order
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if one user tries to fetch another user's order", async () => {
    // Create a ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20,
    });

    await ticket.save();

    // Create two mock users
    const userOne = global.signin_and_get_cookie();

    const userTwo = global.signin_and_get_cookie();

    // userOne Makes request to build an order with this ticket
    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", userOne)
        .send({ ticketId: ticket.id })
        .expect(201);

    // UserTwo Makes request to fetch UserOne's order
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", userTwo)
        .send()
        .expect(401);
});
