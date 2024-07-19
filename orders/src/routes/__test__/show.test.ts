import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../model/ticket";
import mongoose from "mongoose";

it("fetches the order", async () => {
  // Create a ticket with Ticket Model
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();
  const user = await (global as any).signup();

  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to fetch the order

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if one user tries to fetch another users order", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });

  await ticket.save();

  const user = await (global as any).signup();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", await (global as any).signup())
    .send()
    .expect(401);
});

it("returns an error if an order is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/orders/${id}`)
    .set("Cookie", await (global as any).signup())
    .send()
    .expect(404);
});
