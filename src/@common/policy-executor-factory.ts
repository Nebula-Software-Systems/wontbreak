import { RetryPolicyType } from "@/src/retry/models/retry-policy-type";
import { TimeoutPolicyType } from "@/src/timeout/models/timeout-policy-type";
import { CircuitBreakerPolicyType } from "@/src/circuit-breaker/models/circuit-breaker-policy-type";
import { TimeoutPolicyExecutor } from "@/src/timeout/execution/timeout-policy-executor";
import { RetryPolicyExecutor } from "@/src/retry/execution/retry-policy-executor";
import { CircuitBreakerPolicyExecutor } from "@/src/circuit-breaker/execution/circuit-breaker-executor";

/**
 * Factory class to create resiliency policies.
 */
export class PolicyExecutorFactory {
  /**
   * Creates a {@link TimeoutPolicyExecutor | timeout policy executor}.
   *
   * @param timeoutPolicy The {@link TimeoutPolicyType | timeout policy} to configure the timeout policy executor.
   *
   * @returns An instance of {@link TimeoutPolicyExecutor}.
   */
  static createTimeoutHttpExecutor(timeoutPolicy: TimeoutPolicyType) {
    return TimeoutPolicyExecutor.createTimeoutExecutor(timeoutPolicy);
  }

  /**
   * Creates a {@link RetryPolicyExecutor | retry policy executor}.
   *
   * @param retryPolicy The {@link RetryPolicyType | retry policy} to configure the retry policy executor.
   *
   * @returns An instance of {@link RetryPolicyExecutor}.
   */
  static createRetryHttpExecutor(retryPolicy: RetryPolicyType) {
    return RetryPolicyExecutor.createRetryExecutor(retryPolicy);
  }

  /**
   * Creates a {@link CircuitBreakerPolicyExecutor | circuit-breaker policy executor}.
   *
   * @param circuitBreakerPolicy The {@link CircuitBreakerPolicyType | circuit-breaker policy} to configure the circuit-breaker policy executor.
   *
   * @returns An instance of {@link CircuitBreakerPolicyExecutor}.
   */
  static createCircuitBreakerHttpExecutor(
    circuitBreakerPolicy: CircuitBreakerPolicyType
  ) {
    return CircuitBreakerPolicyExecutor.createCircuitBreakerExecutor(
      circuitBreakerPolicy
    );
  }
}
