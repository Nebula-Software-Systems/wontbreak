import axios from "axios";
import { RetryIntervalStrategy } from "../../src/retry/models/retry-interval-options";
import { CircuitState } from "../../src/circuit-breaker/models/circuit-state";
import MockAdapter from "axios-mock-adapter";
import { PolicyExecutorFactory } from "../../src/@common/policy-executor-factory";

describe("Circuit breaker", () => {
  test("circuit state changes from closed to half-opened when number of retries exceeds maximum", async () => {
    const axiosMock = new MockAdapter(axios);
    axiosMock.onGet("/complex").reply(404);

    /**
     * Circuit open
     */

    //Arrange
    const circuitBreakerType = {
      maxNumberOfRetriesBeforeCircuitIsOpen: 1,
      retryIntervalStrategy: RetryIntervalStrategy.Constant,
      baseRetryDelayInSeconds: 0.5,
      timeoutPerRetryInSeconds: 2,
      circuitOpenDurationInSeconds: 3,
      onClose: () => console.log("custom close"),
      onHalfOpen: () => console.log("custom half open"),
      onOpen: () => console.log("custom open"),
    };

    const circuitBreakerExecutor =
      PolicyExecutorFactory.createCircuitBreakerHttpExecutor(
        circuitBreakerType
      );

    const spyOpen = jest.spyOn(circuitBreakerType, "onOpen");
    const spyHalfOpen = jest.spyOn(circuitBreakerType, "onHalfOpen");
    const spyClose = jest.spyOn(circuitBreakerType, "onClose");

    //Act
    const httpResult = await circuitBreakerExecutor.ExecutePolicyAsync<any>(
      axios.get("/complex")
    );

    //Assert
    expect(httpResult.data).toBeNull();
    expect(httpResult.error).not.toBeNull();
    expect(httpResult.error?.reason).toBe("circuitBreaker");
    expect(httpResult.error?.message).toBe(
      "Your request could not be processed. The circuit has been opened for 3 seconds."
    );
    expect(circuitBreakerExecutor.getCurrentCircuitState()).toBe(
      CircuitState.Opened
    );
    expect(spyOpen).toHaveBeenCalledTimes(1);

    /**
     * Circuit from open to half-open
     */
    await new Promise((r) => setTimeout(r, 4000));
    expect(circuitBreakerExecutor.getCurrentCircuitState()).toBe(
      CircuitState.Half_Opened
    );
    expect(spyHalfOpen).toHaveBeenCalledTimes(1);
    expect(spyClose).not.toHaveBeenCalled();
  }, 120000);

  test("when circuit is half-opened and request is sent with success, state changes to closed", async () => {
    //Arrange
    const axiosMock = new MockAdapter(axios);
    axiosMock.onGet("/bad").reply(404);
    axiosMock.onGet("/good").reply(200, {
      messaage: "success",
    });

    const circuitBreakerType = {
      maxNumberOfRetriesBeforeCircuitIsOpen: 1,
      retryIntervalStrategy: RetryIntervalStrategy.Constant,
      baseRetryDelayInSeconds: 0.5,
      timeoutPerRetryInSeconds: 2,
      circuitOpenDurationInSeconds: 3,
      onClose: () => console.log("custom close"),
      onHalfOpen: () => console.log("custom half open"),
      onOpen: () => console.log("custom open"),
    };

    const circuitBreakerExecutor =
      PolicyExecutorFactory.createCircuitBreakerHttpExecutor(
        circuitBreakerType
      );

    const spyOpen = jest.spyOn(circuitBreakerType, "onOpen");
    const spyHalfOpen = jest.spyOn(circuitBreakerType, "onHalfOpen");
    const spyClose = jest.spyOn(circuitBreakerType, "onClose");

    await circuitBreakerExecutor.ExecutePolicyAsync<any>(axios.get("/bad"));

    //waiting for the system to be in half-opened state
    await new Promise((r) => setTimeout(r, 4000));

    //Act
    const httpResult = await circuitBreakerExecutor.ExecutePolicyAsync<any>(
      axios.get("/good")
    );

    //Assert
    expect(httpResult.data).not.toBeNull();
    expect(JSON.stringify(httpResult.data)).toBe(
      JSON.stringify({
        messaage: "success",
      })
    );
    expect(httpResult.error).toBeUndefined();
    expect(circuitBreakerExecutor.getCurrentCircuitState()).toBe(
      CircuitState.Closed
    );

    expect(spyOpen).toHaveBeenCalledTimes(1);
    expect(spyHalfOpen).toHaveBeenCalledTimes(1);
    expect(spyClose).toHaveBeenCalledTimes(1);
  });

  test("when circuit is half-opened and request is sent unsuccessful, state changes to opened", async () => {
    //Arrange
    const axiosMock = new MockAdapter(axios);
    axiosMock.onGet("/bad").reply(404);

    const circuitBreakerType = {
      maxNumberOfRetriesBeforeCircuitIsOpen: 1,
      retryIntervalStrategy: RetryIntervalStrategy.Constant,
      baseRetryDelayInSeconds: 0.5,
      timeoutPerRetryInSeconds: 2,
      circuitOpenDurationInSeconds: 3,
      onClose: () => console.log("custom close"),
      onHalfOpen: () => {},
      onOpen: () => console.log("custom open"),
    };

    const circuitBreakerExecutor =
      PolicyExecutorFactory.createCircuitBreakerHttpExecutor(
        circuitBreakerType
      );

    const spyOpen = jest.spyOn(circuitBreakerType, "onOpen");
    const spyHalfOpen = jest.spyOn(circuitBreakerType, "onHalfOpen");
    const spyClose = jest.spyOn(circuitBreakerType, "onClose");

    await circuitBreakerExecutor.ExecutePolicyAsync<any>(axios.get("/bad"));

    //waiting for the system to be in half-opened state
    await new Promise((r) => setTimeout(r, 4000));

    //Act
    const httpResult = await circuitBreakerExecutor.ExecutePolicyAsync<any>(
      axios.get("/bad")
    );

    //Assert
    expect(httpResult.data).toBeNull();
    expect(httpResult.error).not.toBeNull();
    expect(httpResult.error?.reason).toBe("circuitBreaker");
    expect(httpResult.error?.message).toBe(
      "Your request could not be processed. The circuit has been opened for 3 seconds."
    );
    expect(circuitBreakerExecutor.getCurrentCircuitState()).toBe(
      CircuitState.Opened
    );

    expect(spyOpen).toHaveBeenCalledTimes(2);
    expect(spyHalfOpen).toHaveBeenCalledTimes(1);
    expect(spyClose).toHaveBeenCalledTimes(0);
  });

  test("when circuit is opened and request is sent, error response is sent", async () => {
    //Arrange
    const axiosMock = new MockAdapter(axios);
    axiosMock.onGet("/bad").reply(404);
    axiosMock.onGet("/good").reply(200, {
      messaage: "success",
    });

    const circuitBreakerType = {
      maxNumberOfRetriesBeforeCircuitIsOpen: 1,
      retryIntervalStrategy: RetryIntervalStrategy.Constant,
      baseRetryDelayInSeconds: 0.5,
      timeoutPerRetryInSeconds: 2,
      circuitOpenDurationInSeconds: 3,
      onClose: () => console.log("custom close"),
      onHalfOpen: () => {},
      onOpen: () => console.log("custom open"),
    };

    const circuitBreakerExecutor =
      PolicyExecutorFactory.createCircuitBreakerHttpExecutor(
        circuitBreakerType
      );

    const spyOpen = jest.spyOn(circuitBreakerType, "onOpen");
    const spyHalfOpen = jest.spyOn(circuitBreakerType, "onHalfOpen");
    const spyClose = jest.spyOn(circuitBreakerType, "onClose");

    await circuitBreakerExecutor.ExecutePolicyAsync<any>(axios.get("/bad"));

    //Act
    const httpResult = await circuitBreakerExecutor.ExecutePolicyAsync<any>(
      axios.get("/good")
    );

    //Assert
    expect(httpResult.data).toBeNull();
    expect(httpResult.error).not.toBeNull();
    expect(httpResult.error?.reason).toBe("circuitBreaker");
    expect(httpResult.error?.message).toBe(
      "Your request could not be processed. The circuit has been opened for 3 seconds."
    );
    expect(circuitBreakerExecutor.getCurrentCircuitState()).toBe(
      CircuitState.Opened
    );
    expect(spyOpen).toHaveBeenCalledTimes(1);
    expect(spyHalfOpen).toHaveBeenCalledTimes(0);
    expect(spyClose).toHaveBeenCalledTimes(0);
  });
});
