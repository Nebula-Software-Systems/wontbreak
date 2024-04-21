import { RetryInterval } from "./retry-interval-options";

export type RetryPolicyType = {
  maxNumberRetries: number;
  retryIntervalStrategy?: RetryInterval;
  baseSeconds?: number;
};
