import { CircuitState } from "../models/circuit-state";

/**
 * Interface that defines how the circuit-breaker state machine works.
 */
export interface ICircuitBreakerStateManager {
  /**
   * Gets the current state of the circuit-breaker.
   *
   * @returns A valida circuit-breaker state from {@link CircuitState}.
   */
  getCurrentState(): CircuitState;

  /**
   * Checks if the current circuit-breaker state is open.
   */
  isCurrentStateOpen(): boolean;

  /**
   * Checks if the current circuit-breaker state is half-open.
   */
  isCurrentStateHalfOpen(): boolean;

  /**
   * Checks if the current circuit-breaker state is closed.
   */
  isCurrentStateClosed(): boolean;

  /**
   * Moves the circuit-breaker state to closed.
   *
   * @remarks
   * Valid state transitions to close:
   * - half-open -> close
   */
  moveStateToClosed(): void;

  /**
   * Moves the circuit-breaker state to half-open.
   *
   * @remarks
   * Valid state transitions to half-open:
   * - open -> half-open
   */
  moveStateToHalfOpen(): void;

  /**
   * Moves the circuit-breaker state to open.
   *
   * @remarks
   * Valid state transitions to open:
   * - closed -> open
   * - half-open -> open
   */
  moveStateToOpen(): void;
}
