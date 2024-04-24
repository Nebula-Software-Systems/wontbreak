import { PolicyExecutorFactory } from "../../src/@common/policy-executor-factory";

describe("timeout", () => {
  test("rejection thrown when timeout occurs", async () => {
    //Arrange
    const timeoutPolicyExecutor =
      PolicyExecutorFactory.createTimeoutHttpExecutor({
        timeoutInSeconds: 0.2,
      });

    const httpRequest = () =>
      new Promise((resolve, _) =>
        setTimeout(() => resolve("This will timeout."), 300)
      );

    //Act
    const httpResult = await timeoutPolicyExecutor.ExecutePolicyAsync<string>(
      httpRequest()
    );

    //Assert
    expect(httpResult.data).toBeNull();
    expect(httpResult.error).not.toEqual(null);
    expect(httpResult.error?.reason).toBe("timeout");
    expect(httpResult.error?.message).toBe(
      "A timeout has occured. Timeout defined: 0.2 seconds."
    );
  });

  test("http request completes successfully when no timeout happens", async () => {
    //Arrange
    const timeoutPolicyExecutor =
      PolicyExecutorFactory.createTimeoutHttpExecutor({
        timeoutInSeconds: 0.5,
      });

    const httpRequest = () =>
      new Promise((resolve, _) =>
        setTimeout(() => resolve("This is not timed-out."), 300)
      );

    //Act
    const httpResult = await timeoutPolicyExecutor.ExecutePolicyAsync<string>(
      httpRequest()
    );

    //Assert
    expect(httpResult.data).not.toEqual(null);
    expect(httpResult.data).toBe("This is not timed-out.");
    expect(httpResult.error).toBeNull();
  });
});
