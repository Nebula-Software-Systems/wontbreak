import { CircuitState } from "../models/circuit-state";

export default interface ICircuitBreakerStateManager {
  getCurrentState(): CircuitState;
  isCurrentStateOpen(): boolean;
  isCurrentStateHalfOpen(): boolean;
  isCurrentStateClosed(): boolean;
  moveStateToClosed(): void;
  moveStateToHalfOpen(): void;
  moveStateToOpen(): void;
}
