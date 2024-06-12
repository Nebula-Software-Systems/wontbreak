import { IPolicyExecutor } from "../../@common/policy-executor-interface";
import { Result } from "../../@common/result";
import { TimeoutPolicyType } from "../models/timeout-policy-type";
import { executeHttpRequestWithTimeoutPolicy } from "./timeout-http-request-execution";

/**
 * Policy executor for requests we want to attach a timeout to.
 */
export class TimeoutPolicyExecutor implements IPolicyExecutor {
  private constructor(private timeoutPolicy: TimeoutPolicyType) {}

  async ExecutePolicyAsync<T>(httpRequest: Promise<any>): Promise<Result<T>> {
    try {
      const { data } = await executeHttpRequestWithTimeoutPolicy(
        httpRequest,
        this.timeoutPolicy.timeoutInMilli
      );
      return Result.createSuccessHttpResult<T>(data);
    } catch (error) {
      return Result.createTimedOutErrorResult(error as string);
    }
  }

  /**
   * Creates a {@link TimeoutPolicyExecutor | timeout policy executor}.
   *
   * @param timeoutPolicy The {@link TimeoutPolicyType | timeout policy} to configure the timeout policy executor.
   *
   * @returns An instance of {@link TimeoutPolicyExecutor}.
   */
  static createTimeoutExecutor(timeoutPolicy: TimeoutPolicyType) {
    return new TimeoutPolicyExecutor(timeoutPolicy);
  }
}
