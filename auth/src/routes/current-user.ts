import { Router, Request, Response } from "express";
import { currentUser } from "@mv-tik/common";

const router = Router();

router.route("/currentuser").get(currentUser, (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
