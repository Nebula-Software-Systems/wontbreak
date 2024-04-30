import { RetryIntervalStrategy } from "../models/retry-interval-options";

export default function computeRetryBackoffForStrategyInSeconds(
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
