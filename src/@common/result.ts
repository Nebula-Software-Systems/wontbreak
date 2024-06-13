import { CircuitBreakerError } from "../circuit-breaker/models/circuit-breaker-error";
import { RetryError } from "../retry/models/retry-error";
import { TimeoutError } from "../timeout/models/timeout-error";
import { BaseError } from "./base-error";

/**
 * Class that defines the output of our execution policies and serves as the base response return.
 *
 * @typeParam T - Defines the data type expected from the HTTP request.
 */
export class Result<T> {
  /**
   * Creates an instance of {@link Result}.
   *
   * @param data (optional) If any, represents the data received from the HTTP request.
   * @param error (optional) If any, represents any error that might have happened during the HTTP request.
   *
   * @remarks There should only be either data or error at each {@link Result} instance, depending if we get a successful response or if an error happened.
   */
  private constructor(public data?: T, public error?: BaseError) {}

  /**
   * Creates a {@link Result | response} that represents a successful HTTP  request.
   *
   * @param httpResponse The successful HTTP response.
   *
   * @returns An instance of {@link Result} with the data field having the {@link httpResponse} content.
   */
  static createSuccessHttpResult<T>(httpResponse: T) {
    return new Result(httpResponse);
  }

  /**
   * Creates a {@link Result | response} that represents an HTTP request that got timed out.
   *
   * @param timeoutErrorMessage A timeout error message.
   *
   * @returns An instance of {@link Result} with the error field containing the {@link timeoutErrorMessage} content.
   */
  static createTimedOutErrorResult<T>(timeoutErrorMessage: string) {
    const timeoutError = TimeoutError.createTimeoutError(timeoutErrorMessage);
    return new Result(null as T, timeoutError);
  }

  /**
   * Creates a {@link Result | response} that represents an HTTP request that exceeded the number of retries.
   *
   * @param retryErrorMessage A retry error message.
   *
   * @returns An instance of {@link Result} with the error field containing the {@link retryErrorMessage} content.
   */
  static createRetryErrorResult<T>(retryErrorMessage: string) {
    const retryError = RetryError.createRetryError(retryErrorMessage);
    return new Result(null as T, retryError);
  }

  /**
   * Creates a {@link Result | response} that represents an HTTP request made during the circuit-breaker open stage.
   *
   * @param circuitOpenDurationInMilli How long the circuit will be opened for.
   *
   * @returns An instance of {@link Result} with the error field containing the {@link circuitOpenDurationInMilli} content.
   */
  static createCircuitOpenedErrorResult<T>(
    circuitOpenDurationInMilli: number
  ) {
    const circuitBreakerError = CircuitBreakerError.createCircuitOpenError(
      circuitOpenDurationInMilli
    );
    return new Result(null as T, circuitBreakerError);
  }
}
