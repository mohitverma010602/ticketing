import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const cookie = await (global as any).signup();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", cookie)
    .send({
      title: "concert",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "concert",
      price: 20,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const cookie = await (global as any).signup();

  const response = await request(app)
    .post("/api/tickets/create")
    .set("Cookie", cookie)
    .send({
      title: "concert",
      price: 20,
    })
    .expect(201);

  const cookie2 = await (global as any).signup();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie2)
    .send({
      title: "new concert",
      price: 100,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = await (global as any).signup();

  const response = await request(app)
    .post("/api/tickets/create")
    .set("Cookie", cookie)
    .send({
      title: "concert",
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "concert",
      price: -20,
    })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const cookie = await (global as any).signup();

  const response = await request(app)
    .post("/api/tickets/create")
    .set("Cookie", cookie)
    .send({
      title: "concert",
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new concert",
      price: 100,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();
  expect(ticketResponse.body.title).toEqual("new concert");
  expect(ticketResponse.body.price).toEqual(100);
});
