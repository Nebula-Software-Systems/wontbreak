/**
 * Retry backoff strategies.
 */
export enum RetryIntervalStrategy {
  Constant,
  Linear,
  Linear_With_Jitter,
  Exponential,
  Exponential_With_Jitter,
}
