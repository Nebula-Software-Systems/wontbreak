import axios from "axios";
import { RetryIntervalStrategy } from "../models/retry-interval-options";
import { RetryPolicyType } from "../models/retry-policy-type";
import { computeRetryBackoffForStrategyInSeconds } from "../strategy/retry-backoff-strategy";
import { doesResponseHaveStatusCodeBlockedForRetry } from "./utils/retry-utils";

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

    for (let i = 1; i <= retryPolicyType.maxNumberOfRetries; i++) {
      const nextAttempt = currentAttempt + 1;
      currentAttempt++;
      const retryBackoffStrategy =
        retryPolicyType.retryIntervalStrategy ??
        RetryIntervalStrategy.Linear_With_Jitter;

      const backoffRetryIntervalInSeconds =
        computeRetryBackoffForStrategyInSeconds(
          retryBackoffStrategy,
          nextAttempt,
          retryPolicyType.baseRetryDelayInSeconds
        );

      await waitFor(backoffRetryIntervalInSeconds * 1000);

      try {
        return await axios({
          method: error.config.method,
          url: error.config.url,
          headers: { ...error.config.headers },
          data: { ...error.config.data },
          proxy: false,
          timeout: 5000,
        });
      } catch (error) {
        continue;
      }
    }

    throw new Error(
      `The number of retries (${retryPolicyType.maxNumberOfRetries}) has exceeded.`
    );
  }
}

/**
 * Simulates a waiting time
 * @param timeoutInMilli Time to wait in milliseconds.
 * @returns A promise that gets resolved after a given amount of time defined in {@link timeoutInMilli}.
 */
function waitFor(timeoutInMilli: number) {
  return new Promise((resolve) => setTimeout(resolve, timeoutInMilli));
}
