import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledListener } from '../order-cancelled-listener'
import { OrderCancelledEvent, OrderStatus } from '@wwticketing/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order'

const setup = async () => {
  // create OrderCancelledListener
  const listener = new OrderCancelledListener(natsWrapper.client)

  // create order and persist order
  const orderId = mongoose.Types.ObjectId().toHexString()
  const order = Order.build({
    id: orderId,
    version: 0,
    userId: 'someuser',
    price: 100,
    status: OrderStatus.Created
  })
  await order.save()

  // create OrderCancelledEvent payload
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 1,
    ticket: {
      id: mongoose.Types.ObjectId().toHexString()
    }
  }

  // mock Message object with ack() func
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, order, data, msg }
}


it('updates the status of the order', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(data.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})


it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})