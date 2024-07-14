import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets/create").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/tickets/create").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const cookie = await (global as any).signup();
  const response = await request(app)
    .post("/api/tickets/create")
    .set("Cookie", cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns a error if an invalid title is provided", async () => {
  const cookie = await (global as any).signup();

  await request(app)
    .post("/api/tickets/create")
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets/create")
    .set("Cookie", cookie)
    .send({
      price: 10,
    })
    .expect(400);
});

it("returns a error if an invalid price is provided", async () => {
  const cookie = await (global as any).signup();

  await request(app)
    .post("/api/tickets/create")
    .set("Cookie", cookie)
    .send({
      title: "title",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets/create")
    .set("Cookie", cookie)
    .send({
      title: "title",
    })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  const cookie = await (global as any).signup();

  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = "ticket_title_example";

  await request(app)
    .post("/api/tickets/create")
    .set("Cookie", cookie)
    .send({
      title,
      price: 20,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(title);
});
