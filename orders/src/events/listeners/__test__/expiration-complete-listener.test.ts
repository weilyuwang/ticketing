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


it('udpates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup()
  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)

})


it('emits an OrderCancelled event', async () => {
  const { listener, order, data, msg } = await setup()
  await listener.onMessage(data, msg)

  // assert that the publish() func gets called
  expect(natsWrapper.client.publish).toHaveBeenCalled()

  // Grab the event data that got published
  // tell typescript to calm down as this is just a mock func
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  )

  // assert that correct event data gets sent off
  expect(eventData.id).toEqual(order.id)

})


it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()

})