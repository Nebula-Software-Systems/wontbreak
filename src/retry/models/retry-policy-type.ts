import { RetryIntervalStrategy } from "./retry-interval-options";

export type RetryPolicyType = {
  maxNumberOfRetries: number;
  retryIntervalStrategy?: RetryIntervalStrategy;
  baseRetryDelayInSeconds?: number;
  timeoutPerRetryInSeconds?: number;
};
