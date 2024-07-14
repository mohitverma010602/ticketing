import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@mv-tik/common";
import { Router, Request, Response } from "express";
import { z } from "zod";
import { Ticket } from "../models/ticket";

const router = Router();

const updateTicketValidationSchema = z.object({
  title: z.string().trim().min(1),
  price: z.number().gt(0).multipleOf(0.01),
});

router
  .route("/:id")
  .put(
    requireAuth,
    validateRequest(updateTicketValidationSchema),
    async (req: Request, res: Response) => {
      const { title, price } = req.body;

      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) {
        throw new NotFoundError();
      }

      if (ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
      }

      ticket.set({
        title,
        price,
      });

      await ticket.save();

      res.send(ticket);
    }
  );

export { router as updateTicketRouter };
