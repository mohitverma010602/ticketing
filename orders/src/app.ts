// app.ts
import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { NotFoundError, currentUser, errorHandler } from "@mv-tik/common";
import { newTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

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

app.use("/api/tickets", indexRouter);
app.use("/api/tickets", newTicketRouter);
app.use("/api/tickets", showTicketRouter);
app.use("/api/tickets", updateTicketRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

// Error handling middleware
app.use(errorHandler);

export { app };
