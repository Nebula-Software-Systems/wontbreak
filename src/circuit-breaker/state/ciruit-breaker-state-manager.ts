import { CircuitBreakerPolicyType } from "../models/circuit-breaker-policy-type";
import { CircuitState } from "../models/circuit-state";
import { ICircuitBreakerStateManager } from "./circuit-breaker-state-manager.interface";

/**
 * State machine manager class for the circuit-breaker.
 */
export class CircuitBreakerStateManager implements ICircuitBreakerStateManager {
  private currentState = CircuitState.Closed;
  private onOpen: () => void;
  private onClose: () => void;
  private onHalfOpen: () => void;

  constructor(private circuitBreakerPolicy: CircuitBreakerPolicyType) {
    this.onOpen = () => {
      const fn =
        this.circuitBreakerPolicy.onOpen ??
        (() => console.log("Circuit is now open."));
      fn();
      setTimeout(() => {
        this.onHalfOpen();
      }, this.circuitBreakerPolicy.circuitOpenDurationInSeconds * 1000);
      this.currentState = CircuitState.Opened;
    };

    this.onClose = () => {
      const fn =
        this.circuitBreakerPolicy.onClose ??
        (() => console.log("Circuit is now closed."));
      fn();
      this.currentState = CircuitState.Closed;
    };

    this.onHalfOpen = () => {
      const fn =
        this.circuitBreakerPolicy.onHalfOpen ??
        (() => console.log("Circuit is now half-open."));
      fn();
      this.currentState = CircuitState.Half_Opened;
    };
  }

  getCurrentState(): CircuitState {
    return this.currentState;
  }

  isCurrentStateOpen(): boolean {
    return this.currentState === CircuitState.Opened;
  }

  isCurrentStateHalfOpen(): boolean {
    return this.currentState === CircuitState.Half_Opened;
  }

  isCurrentStateClosed(): boolean {
    return this.currentState === CircuitState.Closed;
  }

  moveStateToClosed(): void {
    if (this.isCurrentStateOpen())
      throw new Error("The state change from opened to closed is not allowed.");
    this.onClose();
  }

  moveStateToHalfOpen(): void {
    if (this.isCurrentStateClosed())
      throw new Error(
        "The state change from closed to half-open is not allowed."
      );

    this.onHalfOpen();
  }

  moveStateToOpen(): void {
    this.onOpen();
  }
}
