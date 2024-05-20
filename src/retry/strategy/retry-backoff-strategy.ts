import { RetryIntervalStrategy } from "../models/retry-interval-options";

/**
 * Computes the backoff interval for the next retry attempt.
 *
 * @param retryStrategy The retry backoff strategy. Available values in {@link RetryIntervalStrategy}.
 *
 * @param nextRetryAttempt The upcoming retry attempt number. Example: 2.
 *
 * @param baseSeconds = 1
 * - Represents a constant of the retry backoff interval computation.
 * - This vaue is only useful when you chose the Constant strategy or any of the Linear strategies in {@link RetryIntervalStrategy}.
 *
 * @returns The interval to wait before the next retry.
 */
export function computeRetryBackoffForStrategyInSeconds(
  retryStrategy: RetryIntervalStrategy,
  nextRetryAttempt: number,
  baseSeconds: number = 1
) {
  switch (retryStrategy) {
    case RetryIntervalStrategy.Constant: {
      return baseSeconds;
    }
    case RetryIntervalStrategy.Linear: {
      return baseSeconds * nextRetryAttempt;
    }
    case RetryIntervalStrategy.Exponential: {
      return Math.pow(2, nextRetryAttempt);
    }
    case RetryIntervalStrategy.Exponential_With_Jitter: {
      return Math.pow(2, nextRetryAttempt) + Math.random();
    }
    case RetryIntervalStrategy.Linear_With_Jitter:
    default: {
      return baseSeconds * nextRetryAttempt + Math.random();
    }
  }
}
