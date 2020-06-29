import { Listener, ExpirationCompleteEvent, Subjects, OrderStatus } from '@wwticketing/common'
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name'
import { Order } from '../../models/order'
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher'

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {

  readonly subject = Subjects.ExpirationComplete;
  readonly queueGroupName: string = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    // find the order and also populate the embedded ticket object
    const order = await Order.findById(data.orderId).populate('ticket')

    if (!order) {
      throw new Error('Order not found')
    }

    // update order status and save 
    order.set({
      status: OrderStatus.Cancelled,
    })
    await order.save()

    // publish OrderCancelled Event
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      }
    })

    msg.ack()

  }

}