import { IPolicyExecutor } from "../@common/policy-executor-interface";
import { Result } from "../@common/result";
import { RetryPolicyType } from "./retry-policy-type";
import { retryHttpRequestExecutionAsync } from "./retry-http-request-execution";
import { timeoutHttpRequestExecution } from "../timeout/timeout-http-request-execution";

export class RetryPolicyExecutor implements IPolicyExecutor {
  private constructor(private retryPolicy: RetryPolicyType) {
    this.retryPolicy = retryPolicy;
  }

  async ExecutePolicyAsync<T>(httpRequest: Promise<any>): Promise<Result<T>> {
    try {
      const result = await retryHttpRequestExecutionAsync(
        this.retryPolicy.timeoutPerRetrySeconds === undefined
          ? httpRequest
          : timeoutHttpRequestExecution(
              httpRequest,
              this.retryPolicy.timeoutPerRetrySeconds
            ),
        this.retryPolicy
      );
      return Result.createSuccessHttpResult<T>(result);
    } catch (error: any) {
      return Result.createRetryErrorResult(error.message as string);
    }
  }

  static createRetryExecutor(retryPolicy: RetryPolicyType) {
    return new RetryPolicyExecutor(retryPolicy);
  }
}
