import { BaseError } from "../../@common/base-error";

/**
 * Error class for the API calls that exceed the maximum number of retries.
 */
export class RetryError extends BaseError {
  private constructor(message: string, reason = "retry") {
    super(reason, message);
  }

  /**
   * Creates a {@link RetryError | retry error}.
   *
   * @param message The retry error message we want the {@link RetryError | retry error} to contain.
   *
   * @returns An instance of {@link RetryError}.
   */
  static createRetryError(message: string) {
    return new RetryError(message);
  }
}
