import { Publisher, Subjects, TicketCreatedEvent } from "@mv-tik/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
