import { natsWrapper } from '../../../nats-wrapper'
import { ExpirationCompleteListener } from '../expiration-complete-listener'
import { Order } from '../../../models/order'
import { Ticket } from '../../../models/ticket'
import mongoose from 'mongoose'
import { OrderStatus, ExpirationCompleteEvent } from '@wwticketing/common'
import { Message } from 'node-nats-streaming'

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 100
  })
  await ticket.save()

  const order = Order.build({
    userId: 'someuser',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket
  })
  await order.save()

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, order, ticket, data, msg }

}