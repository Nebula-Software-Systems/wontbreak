import { RetryPolicyType } from "./../../retry/models/retry-policy-type";
import PolicyExecutorFactory from "../../@common/policy-executor-factory";
import IPolicyExecutor from "../../@common/policy-executor-interface";
import Result from "../../@common/result";
import { CircuitBreakerPolicyType } from "../models/circuit-breaker-policy-type";
import ICircuitBreakerStateManager from "../state/circuit-breaker-state-manager.interface";
import CircuitBreakerStateManager from "../state/ciruit-breaker-state-manager";
import { CircuitState } from "../models/circuit-state";

export default class CircuitBreakerPolicyExecutor implements IPolicyExecutor {
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

  getCurrentCircuitState(): CircuitState {
    return this.circuitBreakerStateManager.getCurrentState();
  }

  static createCircuitBreakerExecutor(
    circuitBreakerPolicy: CircuitBreakerPolicyType
  ) {
    return new CircuitBreakerPolicyExecutor(
      circuitBreakerPolicy,
      new CircuitBreakerStateManager(circuitBreakerPolicy)
    );
  }
}
