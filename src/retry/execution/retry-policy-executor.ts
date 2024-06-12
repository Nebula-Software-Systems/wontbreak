import { IPolicyExecutor } from "../../@common/policy-executor-interface";
import { Result } from "../../@common/result";
import { executeHttpRequestWithTimeoutPolicy } from "../../timeout/execution/timeout-http-request-execution";
import { RetryPolicyType } from "../models/retry-policy-type";
import executeHttpRequestWithRetryPolicy from "./retry-http-request-execution";

/**
 * Policy executor for requests we want to retry.
 */
export class RetryPolicyExecutor implements IPolicyExecutor {
  private constructor(private retryPolicy: RetryPolicyType) {}

  async ExecutePolicyAsync<T>(httpRequest: Promise<any>): Promise<Result<T>> {
    try {
      const httpRequestToExecute = !this.retryPolicy.timeoutPerRetryInMilli
        ? httpRequest
        : executeHttpRequestWithTimeoutPolicy(
            httpRequest,
            this.retryPolicy.timeoutPerRetryInMilli
          );

      const { data } = await executeHttpRequestWithRetryPolicy(
        httpRequestToExecute,
        this.retryPolicy
      );

      return Result.createSuccessHttpResult<T>(data);
    } catch ({ message }: any) {
      return Result.createRetryErrorResult(message as string);
    }
  }

  /**
   * Creates a {@link RetryPolicyExecutor | retry policy executor}.
   *
   * @param retryPolicy The {@link RetryPolicyType | retry policy} to configure the retry policy executor.
   *
   * @returns An instance of {@link RetryPolicyExecutor}.
   */
  static createRetryExecutor(retryPolicy: RetryPolicyType) {
    return new RetryPolicyExecutor(retryPolicy);
  }
}
