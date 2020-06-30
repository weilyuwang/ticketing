import { app } from '../../app'
import request from 'supertest'
import mongoose from 'mongoose'
import { OrderStatus } from '@wwticketing/common'
import { Order } from '../../models/order'

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app).post('/api/payments')
    .set('Cookie', global.signin_and_get_cookie())
    .send({
      token: 'aaaaaaa',
      orderId: mongoose.Types.ObjectId().toHexString()
    })
    .expect(404)
})

it('returns a 401 when purchasing an order that does not belong to the current user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 100,
    status: OrderStatus.Created,
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin_and_get_cookie())
    .send({
      token: 'aaaaaaa',
      orderId: order.id
    })
    .expect(401)
})

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString()
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 100,
    status: OrderStatus.Cancelled,
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin_and_get_cookie(userId))
    .send({
      token: 'secret_token',
      orderId: order.id
    })
    .expect(400)
})