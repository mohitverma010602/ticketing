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
      res.send({ success: true });
    }
  );

export { router as createChargeRouter };
