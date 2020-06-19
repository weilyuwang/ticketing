import nats, { Message, Stan } from "node-nats-streaming";

export abstract class Listener {
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
