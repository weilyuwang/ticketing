import { Publisher, Subjects, TicketUpdatedEvent } from "@wwticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}
