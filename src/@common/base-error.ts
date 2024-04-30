export default abstract class BaseError {
  constructor(public reason: string, public message: string) {
    this.reason = reason;
    this.message = message;
  }
}
