import { BaseError } from "../../@common/base-error";

export class TimeoutError extends BaseError {
  private constructor(message: string, reason = "timeout") {
    super(reason, message);
  }

  static createTimeoutError(message: string) {
    return new TimeoutError(message);
  }
}
