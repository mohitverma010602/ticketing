import { Publisher, OrderCancelledEvent, Subjects } from "@mv-tik/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
