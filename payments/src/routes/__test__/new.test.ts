import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { OrderStatus } from "@mv-tik/common";
import mongoose from "mongoose";

it("returns an 404 when purchasing an order that does not exist", async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const cookie = await (global as any).signup();

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({
      token: "asdasd",
      orderId: orderId,
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that does not belong to the user", async () => {
  const cookie = await (global as any).signup();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({
      token: "asdasd",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", await (global as any).signup(userId))
    .send({
      orderId: order.id,
      token: "asdlkfj",
    })
    .expect(400);
});
