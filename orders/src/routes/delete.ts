import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@mv-tik/common";
import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { Order } from "../model/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publishers";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router
  .route("/:orderId")
  .delete(requireAuth, async (req: Request, res: Response) => {
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

    order.status = OrderStatus.Cancelled;
    await order.save();

    // Publish an event saying that an order was cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  });

export { router as deleteOrderRouter };
