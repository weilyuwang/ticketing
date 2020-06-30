import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  requireAuthMiddleware, validateRequestMiddleware, BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus
} from '@wwticketing/common'
import { Order } from '../models/order'


const router = express.Router()

router.post('/api/payments',
  requireAuthMiddleware,
  [
    body('token').not().isEmpty(),
    body('orderId').not().isEmpty()
  ],
  validateRequestMiddleware,
  async (req: Request, res: Response) => {

    const { token, orderId } = req.body

    const order = await Order.findById(orderId)
    if (!order) {
      throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for an cancelled order')
    }

    res.send({ success: true })
  })


export { router as createChargeRouter }