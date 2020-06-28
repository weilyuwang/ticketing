import { OrderCancelledListener } from '../order-cancelled-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import mongoose from 'mongoose'
import { OrderCancelledEvent } from '@wwticketing/common'
import { Message } from 'node-nats-streaming'

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client)

  // Create and save a ticket
  const orderId = mongoose.Types.ObjectId().toHexString()

  const ticket = Ticket.build({
    title: 'concert',
    price: 100,
    userId: 'someuser'
  })
  ticket.set({ orderId })
  await ticket.save()


  // Create the fake order cancelled event data
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }


  return { listener, ticket, data, orderId, msg }

}


it('updates the ticket, publishes an event, and acks the message', async () => {
  const { listener, ticket, data, orderId, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  // expect the ticket's orderId property to be `undefined`
  expect(updatedTicket!.orderId).not.toBeDefined()
  expect(msg.ack).toHaveBeenCalled()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})