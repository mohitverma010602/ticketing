// app.ts
import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { NotFoundError, currentUser, errorHandler } from "@mv-tik/common";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { indexOrdersRouter } from "./routes";
import { deleteOrderRouter } from "./routes/delete";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

// Routes

app.use("/api/orders", newOrderRouter);
app.use("/api/orders", showOrderRouter);
app.use("/api/orders", indexOrdersRouter);
app.use("/api/orders", deleteOrderRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

// Error handling middleware
app.use(errorHandler);

export { app };
