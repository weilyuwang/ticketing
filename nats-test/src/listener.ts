import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

// randomly generate clientID for now
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
    url: "http://localhost:4222",
});

stan.on("connect", () => {
    console.log("Listener connected to NATS");

    // set to manually acknowledge the receival of event/message
    const options = stan.subscriptionOptions().setManualAckMode(true);

    // channel/subject + queue group
    const subscription = stan.subscribe(
        "ticket:created",
        "orders-service-queue-group",
        options
    );

    // message === event
    subscription.on("message", (msg: Message) => {
        const data = msg.getData();

        if (typeof data === "string") {
            console.log(
                `Received event #${msg.getSequence()}, with data: ${data}`
            );
        }

        // manually ack
        msg.ack();
    });
});
