import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper"; // mock natsWrapper is instead imported by jest

it("marks an order as cancelled", async () => {
    // Create a ticket
    const ticket = Ticket.build({
        title: "concert",
        price: 20,
    });
    await ticket.save();

    // Create a mock user
    const user = global.signin_and_get_cookie();

    // Make a request to create an order
    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ ticketId: ticket.id })
        .expect(201);

    expect(order.status).not.toEqual(OrderStatus.Cancelled);

    // Make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(204);

    // Make sure the order is actually cancelled
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it("emits an order cancelled event", async () => {
    // Create a ticket
    const ticket = Ticket.build({
        title: "concert",
        price: 20,
    });
    await ticket.save();

    // Create a mock user
    const user = global.signin_and_get_cookie();

    // Make a request to create an order
    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // Make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(204);

    // make sure we have called publish() on nats client to publish the event
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
