import { BaseError } from "@/src/@common/base-error";

/**
 * Error class for the API calls that are timed out.
 */
export class TimeoutError extends BaseError {
  private constructor(message: string, reason = "timeout") {
    super(reason, message);
  }

  /**
   * Creates a {@link TimeoutError | timeout error}.
   *
   * @param message The timeout error message we want the {@link TimeoutError | timeout error} to contain.
   *
   * @returns An instance of {@link TimeoutError}.
   */
  static createTimeoutError(message: string) {
    return new TimeoutError(message);
  }
}
