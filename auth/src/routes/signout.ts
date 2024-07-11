import { Router } from "express";

const router = Router();

router.route("/signout").post((req, res) => {
  req.session = null;

  res.send({});
});

export { router as signoutRouter };
