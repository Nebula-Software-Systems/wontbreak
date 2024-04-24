export function executeHttpRequestWithTimeoutPolicy(
  promise: Promise<any>,
  timeoutInSeconds: number
): Promise<any> {
  return Promise.race([
    promise,
    new Promise((_, rejection) =>
      setTimeout(
        () =>
          rejection(
            `A timeout has occured. Timeout defined: ${timeoutInSeconds} seconds.`
          ),
        timeoutInSeconds * 1000
      )
    ),
  ]);
}
