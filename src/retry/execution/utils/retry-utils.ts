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
