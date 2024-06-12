/**
 * Base type for configuring the {@link TimeoutPolicyExecutor}.
 */
export type TimeoutPolicyType = {
  /**
   * HTTP request timeout in milliseconds.
   *
   * If no response is returned within this amount of time, a {@link Result}, with the error field filled with {@link TimeoutError}, is returned.
   */
  timeoutInMilli: number;
};
