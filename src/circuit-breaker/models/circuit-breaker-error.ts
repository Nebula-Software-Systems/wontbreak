import BaseError from "../../@common/base-error";

export default class CircuitBreakerError extends BaseError {
  private constructor(message: string, reason = "circuitBreaker") {
    super(reason, message);
  }

  static createCircuitOpenError(circuitOpenDurationInSeconds: number) {
    return new CircuitBreakerError(
      `Your request could not be processed. The circuit has been opened for ${circuitOpenDurationInSeconds} seconds.`
    );
  }
}
