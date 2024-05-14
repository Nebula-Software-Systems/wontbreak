import { RetryIntervalStrategy } from "../models/retry-interval-options";
import { RetryPolicyType } from "../models/retry-policy-type";
import computeRetryBackoffForStrategyInSeconds from "../strategy/retry-backoff-strategy";
import {
  doesResponseHaveStatusCodeBlockedForRetry,
  isCurrentAttemptBelowMaxNumberOfRetries as isNextAttemptBelowMaxNumberOfRetries,
  retryWithBackoff,
} from "./utils/retry-utils";

/**
 * Executes the current HTTP request with a retry policy.
 *
 * @param httpRequest The current HTTP request.
 *
 * @param retryPolicyType The retry policy type, from {@link RetryPolicyType}.
 *
 * @returns A promise stating if the HTTP request was successful (resolved) or not (rejected when exceeds maximum amount of retry attempts).
 */
export default async function executeHttpRequestWithRetryPolicy(
  httpRequest: Promise<any>,
  retryPolicyType: RetryPolicyType
) {
  return await executeHttpRequestWithRetry(httpRequest, 0, retryPolicyType);
}

/**
 * Executes the current HTTP request with a retry policy.
 *
 * @param httpRequest The current HTTP request.
 *
 * @param currentAttempt The current retry attempt.
 *
 * @param retryPolicyType The retry policy type, from {@link RetryPolicyType}.
 *
 * @returns A promise stating if the HTTP request was successful (resolved) or not (rejected when exceeds maximum amount of retry attempts).
 */
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

    const nextAttempt = currentAttempt + 1;

    if (
      isNextAttemptBelowMaxNumberOfRetries(
        nextAttempt,
        retryPolicyType.maxNumberOfRetries
      )
    ) {
      return retryHttpRequest(httpRequest, nextAttempt, retryPolicyType);
    } else {
      throw new Error(
        `The number of retries (${retryPolicyType.maxNumberOfRetries}) has exceeded.`
      );
    }
  }
}

/**
 * Executes the current HTTP request with a retry policy.
 *
 * @param httpRequest The current HTTP request.
 *
 * @param nextAttempt The next retry attempt.
 *
 * @param retryPolicyType The retry policy type, from {@link RetryPolicyType}.
 *
 * @returns A promise stating if the HTTP request was successful (resolved) or not (rejected when exceeds maximum amount of retry attempts).
 */
function retryHttpRequest(
  httpRequest: Promise<any>,
  nextAttempt: number,
  retryPolicyType: RetryPolicyType
) {
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
