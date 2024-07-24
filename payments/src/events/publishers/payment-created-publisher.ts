import { PaymentCreatedEvent, Publisher, Subjects } from "@mv-tik/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
