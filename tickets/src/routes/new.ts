import { Router } from "express";
import { z } from "zod";
import { requireAuth, validateRequest } from "@mv-tik/common";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

const validateTicket = z.object({
  title: z.string().trim().min(1),
  price: z.number().gt(0).multipleOf(0.01),
});

router
  .route("/create")
  .post(requireAuth, validateRequest(validateTicket), async (req, res) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    // publish an event
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  });

export { router as newTicketRouter };
