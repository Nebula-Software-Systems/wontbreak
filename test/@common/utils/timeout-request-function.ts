export default function createTimedOutRequest(
  httpRequest: Promise<any>,
  timeoutInSeconds: number
): Promise<any> {
  return new Promise(() =>
    setTimeout(() => httpRequest, timeoutInSeconds * 1000)
  );
}
