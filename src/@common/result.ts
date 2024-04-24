import { RetryError } from "../retry/retry-error";
import { TimeoutError } from "../timeout/timeout-error";
import { BaseError } from "./base-error";

export class Result<T> {
  constructor(public data?: any, public error?: any) {
    this.data = data;
    this.error = error;
  }

  static createSuccessHttpResult<T>(httpResponse: T) {
    return new Result(httpResponse, null);
  }

  static createTimedOutErrorResult(timeoutErrorMessage: string) {
    const timeoutError = TimeoutError.createTimeoutError(timeoutErrorMessage);
    return new Result(null, timeoutError);
  }

  static createRetryErrorResult(retryErrorMessage: string) {
    const retryError = RetryError.createRetryError(retryErrorMessage);
    return new Result(null, retryError);
  }
}
