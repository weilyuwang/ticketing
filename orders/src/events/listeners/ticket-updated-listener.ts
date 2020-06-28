import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@wwticketing/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    readonly queueGroupName: string = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { id, title, price, version } = data;

        const ticket = await Ticket.findOne({
            _id: id,
            version: version - 1,
        });

        if (!ticket) {
            throw new Error("TIcket not found");
        }

        ticket.set({ title, price });
        await ticket.save();

        msg.ack();
    }
}
