import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/tickets for post request", async () => {
    const response = await request(app).post("/api/tickets").send({});

    expect(response.status).not.toEqual(404);
});

it("can only be accessed if user is signed in", async () => {
    const response = await request(app).post("/api/tickets").send({});

    expect(response.status).toEqual(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin_and_get_cookie()) // create a cookie to mock sign in
        .send({});

    expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
    // case #1: title is invalid
    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin_and_get_cookie())
        .send({
            title: "",
            price: 10,
        })
        .expect(400);

    // case #2: no title at all
    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin_and_get_cookie())
        .send({
            price: 10,
        })
        .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
    // case #1: price is invalid
    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin_and_get_cookie())
        .send({
            title: "Valid Title",
            price: -10,
        })
        .expect(400);

    // case #2: no price at all
    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin_and_get_cookie())
        .send({
            title: "Valid Title",
        })
        .expect(400);
});

it("creates a ticket with valid inputs", async () => {
    let tickets = await Ticket.find({});

    // initially, there wont be any data in the mock mongodb
    expect(tickets.length).toEqual(0);

    const TITLE = "test_ticket_title";

    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin_and_get_cookie())
        .send({ title: TITLE, price: 20 })
        .expect(201); // expect 201 CREATED

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(20);
    expect(tickets[0].title).toEqual(TITLE);
});

it("publishes an event", async () => {
    // create a ticket
    const TITLE = "test_ticket_title";

    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin_and_get_cookie())
        .send({ title: TITLE, price: 20 })
        .expect(201); // expect 201 CREATED

    // check that if the publish() function has been called (an event has been sent)
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
