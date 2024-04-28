import { IPolicyExecutor } from "../../@common/policy-executor-interface";
import { Result } from "../../@common/result";
import { RetryPolicyType } from "../models/retry-policy-type";
import { executeHttpRequestWithRetryPolicy } from "./retry-http-request-execution";
import { executeHttpRequestWithTimeoutPolicy } from "../../timeout/execution/timeout-http-request-execution";

export class RetryPolicyExecutor implements IPolicyExecutor {
  private constructor(private retryPolicy: RetryPolicyType) {
    this.retryPolicy = retryPolicy;
  }

  async ExecutePolicyAsync<T>(httpRequest: Promise<any>): Promise<Result<T>> {
    try {
      const request =
        this.retryPolicy.timeoutPerRetryInSeconds === undefined
          ? httpRequest
          : executeHttpRequestWithTimeoutPolicy(
              httpRequest,
              this.retryPolicy.timeoutPerRetryInSeconds
            );

      const result = await executeHttpRequestWithRetryPolicy(
        request,
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