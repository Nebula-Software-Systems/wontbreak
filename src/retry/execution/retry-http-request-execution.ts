import { RetryIntervalStrategy } from "../models/retry-interval-options";
import { RetryPolicyType } from "../models/retry-policy-type";
import computeRetryBackoffForStrategyInSeconds from "../strategy/retry-backoff-strategy";
import {
  doesResponseHaveStatusCodeBlockedForRetry,
  isCurrentAttemptBelowMaxNumberOfRetries,
  retryWithBackoff,
} from "./utils/retry-utils";

export default async function executeHttpRequestWithRetryPolicy(
  httpRequest: Promise<any>,
  retryPolicyType: RetryPolicyType
) {
  return await executeHttpRequestWithRetry(httpRequest, 1, retryPolicyType);
}

async function executeHttpRequestWithRetry(
  httpRequest: Promise<any>,
  currentAttempt: number,
  retryPolicyType: RetryPolicyType
): Promise<any> {
  try {
    return await httpRequest;
  } catch (error: any) {
    if (doesResponseHaveStatusCodeBlockedForRetry(error, retryPolicyType)) {
      throw new Error(
        `The http status code of the response indicates that a retry shoudldn't happen. Status code received: ${error.response.status}`
      );
    }
    if (
      isCurrentAttemptBelowMaxNumberOfRetries(
        currentAttempt,
        retryPolicyType.maxNumberOfRetries
      )
    ) {
      return retryHttpRequest(httpRequest, currentAttempt, retryPolicyType);
    } else {
      throw new Error(
        `The number of retries (${retryPolicyType.maxNumberOfRetries}) has exceeded.`
      );
    }
  }
}

function retryHttpRequest(
  httpRequest: Promise<any>,
  currentAttempt: number,
  retryPolicyType: RetryPolicyType
) {
  const nextAttempt = currentAttempt + 1;

  const retryBackoffStrategy =
    retryPolicyType.retryIntervalStrategy ??
    RetryIntervalStrategy.Linear_With_Jitter;

  const backoffRetryIntervalInSeconds = computeRetryBackoffForStrategyInSeconds(
    retryBackoffStrategy,
    nextAttempt,
    retryPolicyType.baseRetryDelayInSeconds
  );

  return retryWithBackoff(
    () =>
      executeHttpRequestWithRetry(httpRequest, nextAttempt, retryPolicyType),
    backoffRetryIntervalInSeconds
  );
}
