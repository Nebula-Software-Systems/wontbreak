import { RetryIntervalStrategy } from "../models/retry-interval-options";

/**
 * Computes the backoff interval for the next retry attempt.
 *
 * @param retryStrategy The retry backoff strategy. Available values in {@link RetryIntervalStrategy}.
 *
 * @param nextRetryAttempt The upcoming retry attempt number. Example: 2.
 *
 * @param baseMilli = 1000
 * - Represents a constant of the retry backoff interval computation.
 * - This vaue is only useful when you chose the Constant strategy or any of the Linear strategies in {@link RetryIntervalStrategy}.
 *
 * @returns The interval to wait before the next retry.
 */
export function computeRetryBackoffForStrategyInMilli(
  retryStrategy: RetryIntervalStrategy,
  nextRetryAttempt: number,
  baseMilli: number = 1000
) {
  switch (retryStrategy) {
    case RetryIntervalStrategy.Constant: {
      return baseMilli;
    }
    case RetryIntervalStrategy.Linear: {
      return baseMilli * nextRetryAttempt;
    }
    case RetryIntervalStrategy.Exponential: {
      return Math.pow(2, nextRetryAttempt) * 1000;
    }
    case RetryIntervalStrategy.Exponential_With_Jitter: {
      return (Math.pow(2, nextRetryAttempt) + Math.random()) * 1000;
    }
    case RetryIntervalStrategy.Linear_With_Jitter:
    default: {
      return baseMilli * nextRetryAttempt + Math.random();
    }
  }
}
