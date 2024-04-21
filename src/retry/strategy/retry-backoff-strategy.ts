import { RetryInterval } from "../retry-interval-options";

export function computeRetryBackoffForStrategyInSeconds(
  retryStrategy: RetryInterval,
  nextRetryAttempt: number,
  baseSeconds: number = 1
) {
  switch (retryStrategy) {
    case RetryInterval.Constant: {
      return baseSeconds;
    }
    case RetryInterval.Linear: {
      return baseSeconds * nextRetryAttempt;
    }
    case RetryInterval.Exponential: {
      return Math.pow(2, nextRetryAttempt);
    }
    case RetryInterval.Exponential_With_Jitter: {
      return Math.pow(2, nextRetryAttempt) + Math.random();
    }
    case RetryInterval.Linear_With_Jitter:
    default: {
      return baseSeconds * nextRetryAttempt + Math.random();
    }
  }
}
