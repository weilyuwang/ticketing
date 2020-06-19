import nats from "node-nats-streaming";
import { Listener } from "./base-listener";

export class TicketCreatedListener extends Listener {
    subject: string = "ticket:created";
    queueGroupName: string = "payments-service";

    onMessage(data: any, msg: nats.Message): void {
        console.log("Event data", data);

        msg.ack();
    }
}
