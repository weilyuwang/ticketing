import { Subjects, Publisher, ExpirationCompleteEvent } from '@wwticketing/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}