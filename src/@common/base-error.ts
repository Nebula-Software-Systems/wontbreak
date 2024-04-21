export abstract class BaseError {
  reason: string;
  message: string;

  constructor(reason: string, message: string) {
    this.reason = reason;
    this.message = message;
  }
}
