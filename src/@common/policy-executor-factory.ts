import { RetryPolicyExecutor } from "../retry/retry-policy-executor";
import { RetryPolicyType } from "../retry/retry-policy-type";
import { TimeoutPolicyExecutor } from "../timeout/execution/timeout-policy-executor";
import { TimeoutPolicyType } from "../timeout/models/timeout-policy-type";

export class PolicyExecutorFactory {
  static createTimeoutHttpExecutor(timeoutPolicyType: TimeoutPolicyType) {
    return TimeoutPolicyExecutor.createTimeoutExecutor(timeoutPolicyType);
  }

  static createRetryHttpExecutor(retryPolicyType: RetryPolicyType) {
    return RetryPolicyExecutor.createRetryExecutor(retryPolicyType);
  }
}
