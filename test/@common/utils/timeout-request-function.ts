export function createTimedOutRequest(
  httpRequest: Promise<any>,
  timeoutInMilli: number
): Promise<any> {
  return new Promise(() => setTimeout(() => httpRequest, timeoutInMilli));
}
