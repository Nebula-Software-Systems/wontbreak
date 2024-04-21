import { BaseError } from "../@common/base-error";

export class RetryError extends BaseError {
  private constructor(reason: string, message: string) {
    super(reason, message);
  }

  static createRetryError(message: string) {
    return new RetryError("retry", message);
  }
}
