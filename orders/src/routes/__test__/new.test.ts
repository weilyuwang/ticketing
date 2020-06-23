import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";

// TODO: Adds user authentication tests

it("returns an error if the ticket does not exist", async () => {
    const ticketId = mongoose.Types.ObjectId();

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin_and_get_cookie())
        .send({
            ticketId: ticketId,
        })
        .expect(404); // NotFoundError:404
});

it("returns an error if the ticket is already reserved", async () => {
    // setup: create a ticket
    const ticket = Ticket.build({
        title: "concert",
        price: 20,
    });
    await ticket.save();

    // setup: create an order thats already reserved (status != cancelled)
    const order = Order.build({
        ticket: ticket,
        userId: "someuserid",
        status: OrderStatus.Created,
        expiresAt: new Date(),
    });
    await order.save();

    // make request
    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin_and_get_cookie())
        .send({
            ticketId: ticket.id,
        })
        .expect(400); // BadRequestError:400
});

it("reserves a ticket", async () => {
    // setup: create a ticket
    const ticket = Ticket.build({
        title: "concert",
        price: 20,
    });
    await ticket.save();

    // make request
    const response = await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin_and_get_cookie())
        .send({
            ticketId: ticket.id,
        })
        .expect(201);

    expect(response.body.ticket.id).toEqual(ticket.id);

    const orders = await Order.find({});
    expect(orders.length).toEqual(1);
    expect(orders[0].ticket.toString()).toEqual(ticket.id);
});

it.todo("emits an order created event");
