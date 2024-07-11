import mongoose from "mongoose";
import { app } from "./app";

(async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("env is not defined");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
})();
