import { Router, Request, Response } from "express";
import { Order } from "../model/order";
import { NotAuthorizedError, NotFoundError, requireAuth } from "@mv-tik/common";
import mongoose from "mongoose";

const router = Router();

router
  .route("/:orderId")
  .get(requireAuth, async (req: Request, res: Response) => {
    const { orderId } = req.params;

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      throw new NotFoundError();
    }

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  });

export { router as showOrderRouter };
