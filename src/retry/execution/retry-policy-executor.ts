import { RetryPolicyType } from "../models/retry-policy-type";
import IPolicyExecutor from "../../@common/policy-executor-interface";
import executeHttpRequestWithTimeoutPolicy from "../../timeout/execution/timeout-http-request-execution";
import Result from "../../@common/result";
import executeHttpRequestWithRetryPolicy from "./retry-http-request-execution";

export default class RetryPolicyExecutor implements IPolicyExecutor {
  private constructor(private retryPolicy: RetryPolicyType) {}

  async ExecutePolicyAsync<T>(httpRequest: Promise<any>): Promise<Result<T>> {
    try {
      const httpRequestToExecute = !this.retryPolicy.timeoutPerRetryInSeconds
        ? httpRequest
        : executeHttpRequestWithTimeoutPolicy(
            httpRequest,
            this.retryPolicy.timeoutPerRetryInSeconds
          );

      const httpResult = await executeHttpRequestWithRetryPolicy(
        httpRequestToExecute,
        this.retryPolicy
      );

      return Result.createSuccessHttpResult<T>(httpResult.data);
    } catch (error: any) {
      return Result.createRetryErrorResult(error.message as string);
    }
  }

  static createRetryExecutor(retryPolicy: RetryPolicyType) {
    return new RetryPolicyExecutor(retryPolicy);
  }
}
