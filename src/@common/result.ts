export class Result<T> {
  timedOut: boolean;
  data?: any;
  error?: any;

  constructor(timedOut: boolean, data?: any, error?: any) {
    this.timedOut = timedOut;
    this.data = data;
    this.error = error;
  }

  static createTimedOutResult(timeoutError: any) {
    return new Result(true, null, timeoutError);
  }

  static createSuccessHttpResult<T>(httpResponse: T) {
    return new Result(false, httpResponse, null);
  }
}
