import { Listener, OrderCreatedEvent, Subjects } from '@wwticketing/common'
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/ticket'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName: string = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id)

    // If no tickets, throw error
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id })

    // Save the ticket
    await ticket.save()

    // ack the message
    msg.ack()

  }

}