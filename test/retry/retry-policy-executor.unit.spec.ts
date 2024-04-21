import { PolicyExecutorFactory } from "../../src/@common/policy-executor-factory";
import { RetryInterval } from "../../src/retry/retry-interval-options";
describe("retry with constant backoff", () => {
  test("error thrown when number of retries exceeds", async () => {
    //Arrange
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberRetries: 3,
      retryIntervalStrategy: RetryInterval.Constant,
      baseSeconds: 0.2,
    });

    const alwaysRetry = () => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject("You shall not pass!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      alwaysRetry()
    );

    //Assert
    expect(httpResult.data).toBeNull();
    expect(httpResult.error).not.toEqual(null);
    expect(httpResult.error?.reason).toBe("retry");
    expect(httpResult.error?.message).toBe(
      "The number of retries (3) has exceeded."
    );
  }, 1200000);

  test("http request completes successfully when no retries occur", async () => {
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberRetries: 3,
      retryIntervalStrategy: RetryInterval.Constant,
      baseSeconds: 0.2,
    });

    const noRetries = () => {
      return new Promise((resolve, _) => {
        setTimeout(() => {
          resolve("It went well in the first attempt!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      noRetries()
    );

    //Assert
    expect(httpResult.data).not.toEqual(null);
    expect(httpResult.data).toEqual("It went well in the first attempt!");
  });
});

describe("retry with linear backoff", () => {
  test("error thrown when number of retries exceeds", async () => {
    //Arrange
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberRetries: 3,
      retryIntervalStrategy: RetryInterval.Linear,
    });

    const alwaysRetry = () => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject("You shall not pass!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      alwaysRetry()
    );

    //Assert
    expect(httpResult.data).toBeNull();
    expect(httpResult.error).not.toEqual(null);
    expect(httpResult.error?.reason).toBe("retry");
    expect(httpResult.error?.message).toBe(
      "The number of retries (3) has exceeded."
    );
  }, 1200000);

  test("http request completes successfully when no retries occur", async () => {
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberRetries: 3,
      retryIntervalStrategy: RetryInterval.Linear,
      baseSeconds: 0.2,
    });

    const noRetries = () => {
      return new Promise((resolve, _) => {
        setTimeout(() => {
          resolve("It went well in the first attempt!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      noRetries()
    );

    //Assert
    expect(httpResult.data).not.toEqual(null);
    expect(httpResult.data).toEqual("It went well in the first attempt!");
  });
});

describe("retry with linear and jitter backoff", () => {
  test("error thrown when number of retries exceeds", async () => {
    //Arrange
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberRetries: 3,
      retryIntervalStrategy: RetryInterval.Linear_With_Jitter,
      baseSeconds: 0.2,
    });

    const alwaysRetry = () => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject("You shall not pass!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      alwaysRetry()
    );

    //Assert
    expect(httpResult.data).toBeNull();
    expect(httpResult.error).not.toEqual(null);
    expect(httpResult.error?.reason).toBe("retry");
    expect(httpResult.error?.message).toBe(
      "The number of retries (3) has exceeded."
    );
  }, 1200000);

  test("http request completes successfully when no retries occur", async () => {
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberRetries: 3,
      retryIntervalStrategy: RetryInterval.Linear_With_Jitter,
      baseSeconds: 0.4,
    });

    const noRetries = () => {
      return new Promise((resolve, _) => {
        setTimeout(() => {
          resolve("It went well in the first attempt!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      noRetries()
    );

    //Assert
    expect(httpResult.data).not.toEqual(null);
    expect(httpResult.data).toEqual("It went well in the first attempt!");
  });
});

describe("retry with exponential backoff", () => {
  test("error thrown when number of retries exceeds", async () => {
    //Arrange
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberRetries: 3,
      retryIntervalStrategy: RetryInterval.Exponential,
    });

    const alwaysRetry = () => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject("You shall not pass!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      alwaysRetry()
    );

    //Assert
    expect(httpResult.data).toBeNull();
    expect(httpResult.error).not.toEqual(null);
    expect(httpResult.error?.reason).toBe("retry");
    expect(httpResult.error?.message).toBe(
      "The number of retries (3) has exceeded."
    );
  }, 1200000);

  test("http request completes successfully when no retries occur", async () => {
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberRetries: 3,
      retryIntervalStrategy: RetryInterval.Exponential,
    });

    const noRetries = () => {
      return new Promise((resolve, _) => {
        setTimeout(() => {
          resolve("It went well in the first attempt!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      noRetries()
    );

    //Assert
    expect(httpResult.data).not.toEqual(null);
    expect(httpResult.data).toEqual("It went well in the first attempt!");
  });
});

describe("retry with exponential jitter backoff", () => {
  test("error thrown when number of retries exceeds", async () => {
    //Arrange
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberRetries: 3,
      retryIntervalStrategy: RetryInterval.Exponential_With_Jitter,
    });

    const alwaysRetry = () => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject("You shall not pass!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      alwaysRetry()
    );

    //Assert
    expect(httpResult.data).toBeNull();
    expect(httpResult.error).not.toEqual(null);
    expect(httpResult.error?.reason).toBe("retry");
    expect(httpResult.error?.message).toBe(
      "The number of retries (3) has exceeded."
    );
  }, 1200000);

  test("http request completes successfully when no retries occur", async () => {
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberRetries: 3,
      retryIntervalStrategy: RetryInterval.Exponential_With_Jitter,
    });

    const noRetries = () => {
      return new Promise((resolve, _) => {
        setTimeout(() => {
          resolve("It went well in the first attempt!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      noRetries()
    );

    //Assert
    expect(httpResult.data).not.toEqual(null);
    expect(httpResult.data).toEqual("It went well in the first attempt!");
  });
});
