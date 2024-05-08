import Result from "./result";

/**
 * Interface that defines the (timeout/retry/circuit-breaker) policy execution.
 */
export default interface IPolicyExecutor {
  /**
   * Executes an http request within a given policy context.
   *
   * @param httpRequest The axios http request that will be executed.
   *
   * @returns A promise of type {@link Result}.
   */
  ExecutePolicyAsync<T>(httpRequest: Promise<any>): Promise<Result<T>>;
}
