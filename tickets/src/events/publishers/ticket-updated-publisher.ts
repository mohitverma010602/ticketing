import { Publisher, Subjects, TicketUpdatedEvent } from "@mv-tik/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
