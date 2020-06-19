import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
    subject: Subjects;
    data: any;
}

export abstract class Publisher<T extends Event> {
    abstract subject: T["subject"];

    private client: Stan;

    constructor(client: Stan) {
        this.client = client;
    }

    publish(data: T["data"]) {
        // need to convert JSON into string before send to NATS streaming
        this.client.publish(this.subject, JSON.stringify(data), () => {
            console.log("Event published");
        });
    }
}
