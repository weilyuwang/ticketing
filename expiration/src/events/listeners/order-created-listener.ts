import { Listener, OrderCreatedEvent, Subjects } from '@wwticketing/common'
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {

  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly queueGroupName: string = queueGroupName;

  onMessage(data: OrderCreatedEvent['data'], msg: Message) {

  }

}