import nats, { Message, Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

// randomly generate clientID for now
const stan: nats.Stan = nats.connect(
    "ticketing",
    randomBytes(4).toString("hex"),
    {
        url: "http://localhost:4222",
    }
);

stan.on("connect", () => {
    console.log("Listener connected to NATS");

    stan.on("close", () => {
        console.log("NATS connection closed");
        process.exit();
    });

    new TicketCreatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());

abstract class Listener {
    // abstract properties and methods
    abstract subject: string; // name of the channel that the listener is listening to
    abstract queueGroupName: string;
    abstract onMessage(data: any, msg: Message): void;

    private client: Stan;
    protected ackWait = 5 * 1000;

    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionOptions(): nats.SubscriptionOptions {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on("message", (msg: Message) => {
            console.log(
                `Message received: ${this.subject} / ${this.queueGroupName}`
            );

            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }

    parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === "string"
            ? JSON.parse(data) // if a string
            : JSON.parse(data.toString("utf8")); // if a buffer
    }
}

class TicketCreatedListener extends Listener {
    subject: string = "ticket:created";
    queueGroupName: string = "payments-service";

    onMessage(data: any, msg: nats.Message): void {
        console.log("Event data", data);

        msg.ack();
    }
}
