import { NotFoundError, requireAuth } from "@mv-tik/common";
import { Router, Request, Response } from "express";
import { Order } from "../model/order";

const router = Router();

router.route("/").get(requireAuth, async (req: Request, res: Response) => {
  const user = req.currentUser!.id;

  const orders = await Order.find({ userId: user }).populate("ticket");

  if (!orders) {
    throw new NotFoundError();
  }

  res.send(orders);
});

export { router as indexOrdersRouter };
