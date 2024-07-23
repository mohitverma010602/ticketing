import { Publisher, Subjects, ExpirationCompleteEvent } from "@mv-tik/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
