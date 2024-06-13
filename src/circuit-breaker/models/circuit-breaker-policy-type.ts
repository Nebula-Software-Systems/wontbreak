import { RetryIntervalStrategy } from "@/src/retry/models/retry-interval-options";

/**
 * Base type for configuring the {@link CircuitBreakerPolicyExecutor}.
 */
export type CircuitBreakerPolicyType = {
  /**
   * Maximum number of retries allowed before the circuit-breaker goes to the open state.
   *
   * @example 5
   *
   * @defaultValue 3
   *
   */
  maxNumberOfRetriesBeforeCircuitIsOpen?: number;

  /**
   * The retry backoff strategy from the {@link RetryIntervalStrategy | list of options}.
   *
   * @defaultValue `RetryIntervalStrategy.Linear_With_Jitter`
   *
   * @example RetryIntervalStrategy.Linear
   */
  retryIntervalStrategy?: RetryIntervalStrategy;

  /**
   * Represents a constant, in milliseconds, of the retry backoff interval computation.
   *
   * @remarks
   *
   * This vaue is only useful when you chose the Constant strategy or any of the Linear strategies in {@link RetryIntervalStrategy}.
   *
   * @defaultValue 1000
   *
   * @example 300
   */
  baseRetryDelayInMilli?: number;

  /**
   * Maximum amount of time a request should take, in milliseconds.
   *
   * @remarks
   *
   * If this is not specified, the request will be kept executing until something
   * eventually comes out from the server
   *
   * @example 500
   */
  timeoutPerRetryInMilli?: number;

  /**
   * The HTTP Status code that, when received from the server, shouldn't be considered for a retry.
   *
   * @defaultValue {@link DefaultRetryExcludedHttpStatusCodes}
   *
   * @example [400, 404]
   */
  excludeRetriesOnStatusCodes?: number[];

  /**
   * Once opened, for how long the circuit will remain in such state, in milliseconds.
   *
   * @example 1000
   */
  circuitOpenDurationInMilli: number;

  /**
   * Callback to be executed on a state transition to open.
   *
   * @defaultValue A simple console.log indicating a state transition to open.
   */
  onOpen?: () => void;

  /**
   * Callback to be executed on a state transition to half-open.
   *
   * @defaultValue A simple console.log indicating a state transition to half-open.
   */
  onHalfOpen?: () => void;

  /**
   * Callback to be executed on a state transition to close.
   *
   * @defaultValue A simple console.log indicating a state transition to close.
   */
  onClose?: () => void;
};
