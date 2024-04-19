import { TimeoutPolicyType } from "./timeout-policy-type";
import { IPolicyExecutor } from "../@common/policy-executor-interface";
import { timeoutHttpRequest } from "./utils/timeout-utils";
import { Result } from "../@common/result";

export class TimeoutPolicyExecutor implements IPolicyExecutor {
  private timeoutPolicy: TimeoutPolicyType;

  constructor(timeoutPolicy: TimeoutPolicyType) {
    this.timeoutPolicy = timeoutPolicy;
  }

  async ExecutePolicyAsync<T>(httpRequest: Promise<any>): Promise<Result<T>> {
    try {
      const result = await timeoutHttpRequest(
        httpRequest,
        this.timeoutPolicy.timeout
      );
      return Result.createSuccessHttpResult<T>(result);
    } catch (error) {
      return Result.createTimedOutResult(error);
    }
  }
}
