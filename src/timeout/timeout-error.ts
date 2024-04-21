import { BaseError } from "../@common/base-error";

export class TimeoutError extends BaseError {
  private constructor(reason: string, message: string) {
    super(reason, message);
  }

  static createTimeoutError(message: string) {
    return new TimeoutError("timeout", message);
  }
}
