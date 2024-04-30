import BaseError from "../../@common/base-error";

export class RetryError extends BaseError {
  private constructor(message: string, reason = "retry") {
    super(reason, message);
  }

  static createRetryError(message: string) {
    return new RetryError(message);
  }
}
