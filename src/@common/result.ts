import RetryError from "../retry/models/retry-error";
import TimeoutError from "../timeout/models/timeout-error";
import BaseError from "./base-error";

export default class Result<T> {
  private constructor(public data?: T, public error?: BaseError) {
    this.data = data;
    this.error = error;
  }

  static createSuccessHttpResult<T>(httpResponse: T) {
    return new Result(httpResponse);
  }

  static createTimedOutErrorResult<T>(timeoutErrorMessage: string) {
    const timeoutError = TimeoutError.createTimeoutError(timeoutErrorMessage);
    return new Result(null as T, timeoutError);
  }

  static createRetryErrorResult<T>(retryErrorMessage: string) {
    const retryError = RetryError.createRetryError(retryErrorMessage);
    return new Result(null as T, retryError);
  }
}
