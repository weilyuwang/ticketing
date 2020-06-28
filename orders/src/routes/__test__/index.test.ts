import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from 'mongoose'


const buildTicket = async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20,
    });
    await ticket.save();
    return ticket;
};

it("fetches orders for a particular user", async () => {
    // Create three tickets
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    // Create User #1 and User #2
    const userOne = global.signin_and_get_cookie();
    const userTwo = global.signin_and_get_cookie();

    // Create one order as User #1
    await request(app)
        .post("/api/orders")
        .set("Cookie", userOne)
        .send({ ticketId: ticketOne.id })
        .expect(201);

    // Create two orders as User #2
    const { body: orderOne } = await request(app)
        .post("/api/orders")
        .set("Cookie", userTwo)
        .send({ ticketId: ticketTwo.id })
        .expect(201);

    const { body: orderTwo } = await request(app)
        .post("/api/orders")
        .set("Cookie", userTwo)
        .send({ ticketId: ticketThree.id })
        .expect(201);

    // Make request to get orders for User #2
    const response = await request(app)
        .get("/api/orders")
        .set("Cookie", userTwo)
        .expect(200);

    // Make sure we only got the orders for User #2
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
});
