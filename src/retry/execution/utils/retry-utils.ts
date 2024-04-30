import { DefaultRetryExcludedHttpStatusCodes } from "../../models/default-retry-excluded-http-status-codes";
import { RetryPolicyType } from "../../models/retry-policy-type";

export const retryWithBackoff = (
  httpRequest: any,
  backoffRetryIntervalInSeconds: number
) =>
  new Promise((resolve) =>
    setTimeout(
      () => resolve(httpRequest()),
      backoffRetryIntervalInSeconds * 1000
    )
  );

export const blockedStatusCodesForRetry = (retryPolicy: RetryPolicyType) =>
  retryPolicy.excludeRetriesOnStatusCodes ??
  DefaultRetryExcludedHttpStatusCodes;

export function doesResponseHaveStatusCodeBlockedForRetry(
  error: any,
  retryPolicyType: RetryPolicyType
) {
  return (
    error.response &&
    error.response.status &&
    blockedStatusCodesForRetry(retryPolicyType).includes(error.response.status)
  );
}

export const isCurrentAttemptBelowMaxNumberOfRetries = (
  currentAttempt: number,
  maxNumberOfRetries: number
) => currentAttempt <= maxNumberOfRetries;
