import { TimeoutPolicyExecutor } from "../timeout/timeout-policy-executor";
import { TimeoutPolicyType } from "../timeout/timeout-policy-type";
import { IPolicyExecutor } from "./policy-executor-interface";

export class PolicyExecutorFactory {
  static createHttpExecutor(
    policyConfiguration: TimeoutPolicyType
  ): IPolicyExecutor {
    // if (policyConfiguration as TimeoutPolicyType) {
    return new TimeoutPolicyExecutor(policyConfiguration as TimeoutPolicyType);
    // }
  }
}
