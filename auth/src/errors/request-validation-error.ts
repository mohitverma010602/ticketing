import { ZodIssue } from "zod";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ZodIssue[]) {
    super("Invalid credentials");

    this.errors = errors;

    // Only because we are extending a built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => ({
      message: err.message,
      field: err.path[0].toString(),
    }));
  }
}
