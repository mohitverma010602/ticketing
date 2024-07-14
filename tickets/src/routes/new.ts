import { Router } from "express";
import { z } from "zod";
import { requireAuth, validateRequest } from "@mv-tik/common";
import { Ticket } from "../models/ticket";

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

    res.status(201).send(ticket);
  });

export { router as newTicketRouter };
