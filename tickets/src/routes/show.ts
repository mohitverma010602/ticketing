import { Router, Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@mv-tik/common";

const router = Router();

router.route("/:id").get(async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.status(200).send(ticket);
});

export { router as showTicketRouter };
