/**
 * Base abstract class for the errors thrown by the API calls.
 */
export abstract class BaseError {
  /**
   * Creates an instance of {@link BaseError}.
   *
   * @param reason  The reason why the error was thrown.
   * @param message The error message containing more information on the error thrown.
   */
  constructor(public reason: string, public message: string) {}
}
