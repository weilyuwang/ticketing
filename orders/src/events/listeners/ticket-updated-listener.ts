import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@wwticketing/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    readonly queueGroupName: string = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {

        const ticket = await Ticket.findByEvent(data)
        if (!ticket) {
            throw new Error("TIcket not found");
        }

        ticket.set({ title: data.title, price: data.price });
        await ticket.save();

        msg.ack();
    }
}
