import { Publisher, OrderCancelledEvent, Subjects } from "@wwticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}
