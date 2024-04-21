import { TimeoutPolicyType } from "./timeout-policy-type";
import { IPolicyExecutor } from "../@common/policy-executor-interface";
import { timeoutHttpRequestExecution } from "./timeout-http-request-execution";
import { Result } from "../@common/result";

export class TimeoutPolicyExecutor implements IPolicyExecutor {
  private timeoutPolicy: TimeoutPolicyType;

  private constructor(timeoutPolicy: TimeoutPolicyType) {
    this.timeoutPolicy = timeoutPolicy;
  }

  async ExecutePolicyAsync<T>(httpRequest: Promise<any>): Promise<Result<T>> {
    try {
      const result = await timeoutHttpRequestExecution(
        httpRequest,
        this.timeoutPolicy.timeout
      );
      return Result.createSuccessHttpResult<T>(result);
    } catch (error) {
      return Result.createTimedOutErrorResult(error as string);
    }
  }

  static createTimeoutExecutor(timeoutPolicy: TimeoutPolicyType) {
    return new TimeoutPolicyExecutor(timeoutPolicy);
  }
}
