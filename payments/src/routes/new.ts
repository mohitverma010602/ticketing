import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@mv-tik/common";
import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

const newChargeValidationSchema = z.object({
  token: z.string().trim().min(1),
  orderId: z.string().trim().min(1),
});

router
  .route("/")
  .post(
    requireAuth,
    validateRequest(newChargeValidationSchema),
    async (req: Request, res: Response) => {
      const { token, orderId } = req.body;

      if (!token || !orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
        throw new NotFoundError();
      }

      const order = await Order.findById(orderId);

      if (!order) {
        throw new NotFoundError();
      }

      if (order?.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
      }
      if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError("Cannot pay for an cancelled order");
      }

      const charge = await stripe.charges.create({
        currency: "usd",
        amount: order.price * 100,
        source: token,
      });

      const payment = Payment.build({
        orderId,
        stripeId: charge.id,
      });
      await payment.save();

      new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId,
      });

      res.status(201).send({ id: payment.id });
    }
  );

export { router as createChargeRouter };
