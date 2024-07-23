import mongoose from "mongoose";
import { Ticket } from "../../../model/ticket";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { ExpirationCompleteEvent, OrderStatus } from "@mv-tik/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../model/order";

const setup = async () => {
  // create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: "asdf",
    expiresAt: new Date(),
    ticket,
  });

  await order.save();
  // create a fake data event
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, order, ticket, data, msg };
};

it("updates the ticket and publishes an event", async () => {
  const { listener, order, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(data.orderId);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emit an OrderCancelled event", async () => {
  const { listener, order, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
