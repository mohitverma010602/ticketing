// app.ts
import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { NotFoundError, currentUser, errorHandler } from "@mv-tik/common";
import { createChargeRouter } from "./routes/new";

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
app.use("/api/payments", createChargeRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

// Error handling middleware
app.use(errorHandler);

export { app };
