import { RetryPolicyType } from "./../../retry/models/retry-policy-type";
import { CircuitBreakerPolicyType } from "../models/circuit-breaker-policy-type";
import { CircuitState } from "../models/circuit-state";
import { PolicyExecutorFactory } from "../../@common/policy-executor-factory";
import { IPolicyExecutor } from "../../@common/policy-executor-interface";
import { Result } from "../../@common/result";
import { ICircuitBreakerStateManager } from "../state/circuit-breaker-state-manager.interface";
import { CircuitBreakerStateManager } from "../state/ciruit-breaker-state-manager";

/**
 * Policy executor for requests we want to maintain a circuit-breaker for.
 */
export class CircuitBreakerPolicyExecutor implements IPolicyExecutor {
  private retryPolicyExecutor: IPolicyExecutor;

  private constructor(
    private circuitBreakerPolicy: CircuitBreakerPolicyType,
    private circuitBreakerStateManager: ICircuitBreakerStateManager
  ) {
    const retryPolicyType: RetryPolicyType = {
      ...this.circuitBreakerPolicy,
      maxNumberOfRetries:
        this.circuitBreakerPolicy.maxNumberOfRetriesBeforeCircuitIsOpen,
    };
    this.retryPolicyExecutor =
      PolicyExecutorFactory.createRetryHttpExecutor(retryPolicyType);
  }

  async ExecutePolicyAsync<T>(httpRequest: Promise<any>): Promise<Result<T>> {
    if (this.circuitBreakerStateManager.isCurrentStateOpen()) {
      return Result.createCircuitOpenedErrorResult(
        this.circuitBreakerPolicy.circuitOpenDurationInSeconds
      );
    }

    const httpResult = await this.retryPolicyExecutor.ExecutePolicyAsync<T>(
      httpRequest
    );

    if (httpResult.data) {
      if (this.circuitBreakerStateManager.isCurrentStateHalfOpen()) {
        this.circuitBreakerStateManager.moveStateToClosed();
      }

      return Result.createSuccessHttpResult<T>(httpResult.data);
    } else {
      this.circuitBreakerStateManager.moveStateToOpen();

      return Result.createCircuitOpenedErrorResult(
        this.circuitBreakerPolicy.circuitOpenDurationInSeconds
      );
    }
  }

  /**
   * Gets the current state of the circuit.
   *
   * @returns The current state of the circuit.
   */
  getCurrentCircuitState(): CircuitState {
    return this.circuitBreakerStateManager.getCurrentState();
  }

  /**
   * Creates a {@link CircuitBreakerPolicyExecutor | circuit-breaker policy executor}.
   *
   * @param circuitBreakerPolicy The {@link CircuitBreakerPolicyType | circuit-breaker policy} to configure the circuit-breaker policy executor.
   *
   * @returns An instance of {@link CircuitBreakerPolicyExecutor}.
   */
  static createCircuitBreakerExecutor(
    circuitBreakerPolicy: CircuitBreakerPolicyType
  ) {
    return new CircuitBreakerPolicyExecutor(
      circuitBreakerPolicy,
      new CircuitBreakerStateManager(circuitBreakerPolicy)
    );
  }
}
