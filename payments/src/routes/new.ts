import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  requireAuthMiddleware, validateRequestMiddleware, BadRequestError, NotFoundError
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
    res.send({ success: true })
  })


export { router as createChargeRouter }