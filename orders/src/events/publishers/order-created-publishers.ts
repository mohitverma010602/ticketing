import { Publisher, OrderCreatedEvent, Subjects } from "@mv-tik/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
