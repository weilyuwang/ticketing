import { Listener, OrderCreatedEvent, Subjects } from '@wwticketing/common'
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name'
import { expirationQueue } from '../../queues/expiration-queue'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {

  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

    const delay = new Date(data.expiresAt).getTime() - new Date().getTime() // get time difference in milliseconds
    console.log('Waiting this many miliseconds to process the job:', delay)

    await expirationQueue.add({
      orderId: data.id
    }, {
      delay: delay, // unit: millisecond
    })

    msg.ack()
  }
}