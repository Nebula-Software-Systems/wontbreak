import { BaseError } from "../../@common/base-error";

/**
 * Error class for the API calls that occur when the circuit is open.
 */
export class CircuitBreakerError extends BaseError {
  private constructor(message: string, reason = "circuitBreaker") {
    super(reason, message);
  }

  /**
   * Creates a {@link CircuitBreakerError | circuit open error}.
   *
   * @param circuitOpenDurationInSeconds How long the circuit will remain open.
   *
   * @returns An instance of {@link CircuitBreakerError}.
   */
  static createCircuitOpenError(circuitOpenDurationInSeconds: number) {
    return new CircuitBreakerError(
      `Your request could not be processed. The circuit has been opened for ${circuitOpenDurationInSeconds} seconds.`
    );
  }
}
