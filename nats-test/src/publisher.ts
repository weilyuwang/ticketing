import nats from "node-nats-streaming";
import { Publisher } from "./events/base-publisher";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

const HARD_CODED_DATA = {
    id: "123456",
    title: "concert",
    price: 1000,
};

console.clear();

// community convention: use stan to indicate a nats client
const stan = nats.connect("ticketing", "abc", {
    url: "http://localhost:4222",
});

stan.on("connect", () => {
    console.log("Publisher connected to NATS");

    const publisher = new TicketCreatedPublisher(stan);

    // publish data
    publisher.publish(HARD_CODED_DATA);
});
