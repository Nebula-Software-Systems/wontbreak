/**
 * Executes an HTTP request with a timeout trigger.
 *
 * @param promise The HTTP request.
 * @param timeoutInMilli The HTTP request timeout.
 *
 * @returns A promise resolved or rejected depending if the HTTP request succeded before the timeout happened (resolved) or not (rejected).
 */
export function executeHttpRequestWithTimeoutPolicy(
  promise: Promise<any>,
  timeoutInMilli: number
): Promise<any> {
  return Promise.race([
    promise,
    new Promise((_, rejection) =>
      setTimeout(
        () =>
          rejection(
            `A timeout has occured. Timeout defined: ${timeoutInMilli} milliseconds.`
          ),
        timeoutInMilli
      )
    ),
  ]);
}
