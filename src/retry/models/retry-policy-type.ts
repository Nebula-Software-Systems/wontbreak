import { RetryIntervalStrategy } from "./retry-interval-options";

/**
 * Base type for configuring the {@link RetryPolicyExecutor}.
 */
export type RetryPolicyType = {
  /**
   * Maximum number of retries allow after the first attempt has failed.
   *
   * @example 3
   */
  maxNumberOfRetries: number;

  /**
   * The retry backoff strategy from the {@link RetryIntervalStrategy | list of options}.
   *
   * @defaultValue `RetryIntervalStrategy.Linear_With_Jitter`
   *
   * @example RetryIntervalStrategy.Linear
   */
  retryIntervalStrategy?: RetryIntervalStrategy;

  /**
   * Represents a constant of the retry backoff interval computation.
   *
   * @remarks
   *
   * This vaue is only useful when you chose the Constant strategy or any of the Linear strategies in {@link RetryIntervalStrategy}.
   *
   * @defaultValue 1
   *
   * @example 0.3
   */
  baseRetryDelayInSeconds?: number;

  /**
   * Maximum amount of time a request should take, in seconds.
   *
   * @remarks
   *
   * If this is not specified, the request will be kept executing until something
   * eventually comes out from the server
   *
   * @example 0.5
   */
  timeoutPerRetryInSeconds?: number;

  /**
   * The HTTP Status code that, when received from the server, shouldn't be considered for a retry.
   *
   * @defaultValue {@link DefaultRetryExcludedHttpStatusCodes}
   *
   * @example [400, 404]
   */
  excludeRetriesOnStatusCodes?: number[];
};
