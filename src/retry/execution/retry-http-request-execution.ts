import { DefaultRetryExcludedHttpStatusCodes } from "../models/default-retry-excluded-http-status-codes";
import { RetryIntervalStrategy } from "../models/retry-interval-options";
import { RetryPolicyType } from "../models/retry-policy-type";
import { computeRetryBackoffForStrategyInSeconds } from "../strategy/retry-backoff-strategy";

export async function executeHttpRequestWithRetryPolicy(
  httpRequest: Promise<any>,
  retryPolicyType: RetryPolicyType
) {
  return await retryHttpIteration(httpRequest, 1, retryPolicyType);
}

async function retryHttpIteration(
  httpRequest: Promise<any>,
  currentAttempt: number,
  retryPolicyType: RetryPolicyType
): Promise<any> {
  try {
    return await httpRequest;
  } catch (error: any) {
    if (
      error.response &&
      error.response.status &&
      blockedStatusCodesForRetry(retryPolicyType).includes(
        error.response.status
      )
    ) {
      throw new Error(
        `The http status code of the response indicates that a retry shoudldn't happen. Status code received: ${error.response.status}`
      );
    }
    if (currentAttempt <= retryPolicyType.maxNumberOfRetries) {
      const nextAttempt = currentAttempt + 1;

      const retryBackoffStrategy =
        retryPolicyType.retryIntervalStrategy ??
        RetryIntervalStrategy.Linear_With_Jitter;

      const backoffRetryIntervalInSeconds =
        computeRetryBackoffForStrategyInSeconds(
          retryBackoffStrategy,
          nextAttempt,
          retryPolicyType.baseRetryDelayInSeconds
        );

      return retryWithBackoff(
        () => retryHttpIteration(httpRequest, nextAttempt, retryPolicyType),
        backoffRetryIntervalInSeconds
      );
    } else {
      throw new Error(
        `The number of retries (${retryPolicyType.maxNumberOfRetries}) has exceeded.`
      );
    }
  }
}

const retryWithBackoff = (
  httpRequest: any,
  backoffRetryIntervalInSeconds: number
) =>
  new Promise((resolve) =>
    setTimeout(
      () => resolve(httpRequest()),
      backoffRetryIntervalInSeconds * 1000
    )
  );

const blockedStatusCodesForRetry = (retryPolicy: RetryPolicyType) =>
  retryPolicy.excludeRetriesOnStatusCodes ??
  DefaultRetryExcludedHttpStatusCodes;
