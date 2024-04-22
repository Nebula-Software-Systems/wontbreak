export function timeoutHttpRequestExecution(
  promise: Promise<any>,
  timeoutSeconds: number
): Promise<any> {
  return Promise.race([
    promise,
    new Promise((_, rejection) =>
      setTimeout(
        () =>
          rejection(
            `A timeout has occured. Timeout defined: ${timeoutSeconds} seconds.`
          ),
        timeoutSeconds * 1000
      )
    ),
  ]);
}
