import { Subjects, Publisher, PaymentCreatedEvent } from '@wwticketing/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}