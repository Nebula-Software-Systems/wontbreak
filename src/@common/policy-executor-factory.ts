import { RetryPolicyExecutor } from "../retry/execution/retry-policy-executor";
import { RetryPolicyType } from "../retry/models/retry-policy-type";
import { TimeoutPolicyExecutor } from "../timeout/execution/timeout-policy-executor";
import { TimeoutPolicyType } from "../timeout/models/timeout-policy-type";

export class PolicyExecutorFactory {
  static createTimeoutHttpExecutor(timeoutPolicy: TimeoutPolicyType) {
    return TimeoutPolicyExecutor.createTimeoutExecutor(timeoutPolicy);
  }

  static createRetryHttpExecutor(retryPolicy: RetryPolicyType) {
    return RetryPolicyExecutor.createRetryExecutor(retryPolicy);
  }
}
