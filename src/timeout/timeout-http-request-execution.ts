export function timeoutHttpRequestExecution(
  promise: Promise<any>,
  timeout: number
): Promise<any> {
  return Promise.race([
    promise,
    new Promise((_, rejection) =>
      setTimeout(
        () =>
          rejection(
            `A timeout has occured. Timeout defined: ${timeout / 1000} seconds.`
          ),
        timeout
      )
    ),
  ]);
}
