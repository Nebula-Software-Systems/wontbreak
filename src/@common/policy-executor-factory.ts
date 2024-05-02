import CircuitBreakerPolicyExecutor from "../circuit-breaker/execution/circuit-breaker-executor";
import { CircuitBreakerPolicyType } from "../circuit-breaker/models/circuit-breaker-policy-type";
import RetryPolicyExecutor from "../retry/execution/retry-policy-executor";
import { RetryPolicyType } from "../retry/models/retry-policy-type";
import TimeoutPolicyExecutor from "../timeout/execution/timeout-policy-executor";
import { TimeoutPolicyType } from "../timeout/models/timeout-policy-type";

export default class PolicyExecutorFactory {
  static createTimeoutHttpExecutor(timeoutPolicy: TimeoutPolicyType) {
    return TimeoutPolicyExecutor.createTimeoutExecutor(timeoutPolicy);
  }

  static createRetryHttpExecutor(retryPolicy: RetryPolicyType) {
    return RetryPolicyExecutor.createRetryExecutor(retryPolicy);
  }

  static createCircuitBreakerHttpExecutor(
    circuitBreakerPolicy: CircuitBreakerPolicyType
  ) {
    return CircuitBreakerPolicyExecutor.createCircuitBreakerExecutor(
      circuitBreakerPolicy
    );
  }
}
