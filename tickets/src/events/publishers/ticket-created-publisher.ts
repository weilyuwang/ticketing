import { Publisher, Subjects, TicketCreatedEvent } from "@wwticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}
