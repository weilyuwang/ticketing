import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

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

it("returns a 401 if the user does not own the ticket", async () => {});

it("returns a 400 if the user provides an invalid title or price", async () => {});

it("udpates the ticket provided valid inputs", async () => {});