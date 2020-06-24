import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@wwticketing/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    readonly queueGroupName: string = queueGroupName;

    async onMessage(
        data: { id: string; title: string; price: number; userId: string },
        msg: Message
    ) {
        const { id, title, price } = data;

        const ticket = await Ticket.findById(id);

        if (!ticket) {
            throw new Error("TIcket not found");
        }

        ticket.set({ title, price });
        await ticket.save();

        msg.ack();
    }
}
