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

    // async function
    publish(data: T["data"]): Promise<void> {
        return new Promise((resolve, reject) => {
            // need to convert JSON into string before send to NATS streaming
            this.client.publish(this.subject, JSON.stringify(data), (err) => {
                if (err) {
                    return reject(err);
                }
                // if no error occurred, resolve
                console.log("Event published to subject", this.subject);
                resolve();
            });
        });
    }
}
