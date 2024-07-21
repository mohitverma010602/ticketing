import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@mv-tik/common";
import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { Ticket } from "../model/ticket";
import { Order, OrderStatus } from "../model/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publishers";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const newOrderValidationSchema = z.object({
  ticketId: z
    .string()
    .trim()
    .min(1, "TicketId must be provided")
    .refine((value) => mongoose.isValidObjectId(value), {
      message: "Invalid ticketId",
    }),
});

router.post(
  "/",
  requireAuth,
  validateRequest(newOrderValidationSchema),
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket that the user is trying to order
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      // throw new NotFoundError();
      console.log("Ticket not found");
      throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
