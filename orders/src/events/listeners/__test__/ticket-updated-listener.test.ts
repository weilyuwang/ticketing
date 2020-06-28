import { TicketCreatedListener } from '../ticket-created-listener'
import { Ticket } from '../../../models/ticket'
import { natsWrapper } from '../../../nats-wrapper'
import { TicketUpdatedEvent } from '@wwticketing/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { TicketUpdatedListener } from '../ticket-updated-listener'


const setup = async () => {
  // Create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client)

  // Create and save a ticket 
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 100
  })
  await ticket.save()

  // Create a fake TicketUpdatedEvent data 
  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'new concert',
    price: 999,
    userId: mongoose.Types.ObjectId().toHexString()
  }

  // Create a fake msg
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  // return all of this stuff
  return { listener, data, ticket, msg }
}


it('finds, updates, and saves a ticket', async () => {
  const { listener, data, ticket, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.title).toEqual(data.title)
  expect(updatedTicket!.price).toEqual(data.price)
  expect(updatedTicket!.version).toEqual(data.version)

})


it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})