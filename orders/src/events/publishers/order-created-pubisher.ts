import { Publisher, OrderCreatedEvent, Subjects } from "@wwticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}
