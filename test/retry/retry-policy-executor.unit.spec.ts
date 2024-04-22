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

    const httpRequest = () => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject("You shall not pass!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      httpRequest()
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

    const httpRequest = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("It went well in the first attempt!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      httpRequest()
    );

    //Assert
    expect(httpResult.data).not.toEqual(null);
    expect(httpResult.data).toEqual("It went well in the first attempt!");
  });
});

describe("retry with constant backoff with timeout on retry", () => {
  test("error thrown when timeout occurs on retry", async () => {
    //Arrange
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberRetries: 3,
      retryIntervalStrategy: RetryInterval.Constant,
      baseSeconds: 0.2,
      timeoutPerRetrySeconds: 0.3,
    });

    const httpRequest = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("This would execute well if it weren't for the timeout.");
        }, 400);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      httpRequest()
    );

    //Assert
    expect(httpResult.data).toBeNull();
    expect(httpResult.error).not.toEqual(null);
    expect(httpResult.error?.reason).toBe("retry");
    expect(httpResult.error?.message).toBe(
      "The number of retries (3) has exceeded."
    );
  }, 1200000);

  test("http request completes successfully when no retries occur nor timeouts", async () => {
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberRetries: 3,
      retryIntervalStrategy: RetryInterval.Constant,
      baseSeconds: 0.2,
      timeoutPerRetrySeconds: 0.4,
    });

    const httpRequest = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("It went well in the first attempt!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      httpRequest()
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

    const httpRequest = () => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject("You shall not pass!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      httpRequest()
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

    const httpRequest = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("It went well in the first attempt!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      httpRequest()
    );

    //Assert
    expect(httpResult.data).not.toEqual(null);
    expect(httpResult.data).toEqual("It went well in the first attempt!");
  });
});

describe("retry with linear backoff with timeout on retry", () => {
  test("error thrown when timeout on retry occurs", async () => {
    //Arrange
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberRetries: 3,
      retryIntervalStrategy: RetryInterval.Linear,
      timeoutPerRetrySeconds: 0.3,
    });

    const httpRequest = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("This would execute well if it weren't for the timeout.");
        }, 600);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      httpRequest()
    );

    //Assert
    expect(httpResult.data).toBeNull();
    expect(httpResult.error).not.toEqual(null);
    expect(httpResult.error?.reason).toBe("retry");
    expect(httpResult.error?.message).toBe(
      "The number of retries (3) has exceeded."
    );
  }, 1200000);

  test("http request completes successfully when no timeouts on retries occurs", async () => {
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberRetries: 3,
      retryIntervalStrategy: RetryInterval.Linear,
      baseSeconds: 0.2,
      timeoutPerRetrySeconds: 1,
    });

    const httpRequest = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("It went well in the first attempt!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      httpRequest()
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

    const httpRequest = () => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject("You shall not pass!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      httpRequest()
    );

    //Assert
    expect(httpResult.data).toBeNull();
    expect(httpResult.error).not.toEqual(null);
    expect(httpResult.error?.reason).toBe("retry");
    expect(httpResult.error?.message).toBe(
      "The number of retries (3) has exceeded."
    );
  }, 1200000);

  test("http request completes successfully when no retries occurs", async () => {
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberRetries: 3,
      retryIntervalStrategy: RetryInterval.Linear_With_Jitter,
      baseSeconds: 0.4,
    });

    const httpRequest = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("It went well in the first attempt!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      httpRequest()
    );

    //Assert
    expect(httpResult.data).not.toEqual(null);
    expect(httpResult.data).toEqual("It went well in the first attempt!");
  });
});

describe("retry with linear and jitter backoff with timeout on retry", () => {
  test("error thrown when timeout on retries occurs", async () => {
    //Arrange
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberRetries: 3,
      retryIntervalStrategy: RetryInterval.Linear_With_Jitter,
      baseSeconds: 0.2,
      timeoutPerRetrySeconds: 0.3,
    });

    const httpRequest = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("This would execute well if it weren't for the timeout.");
        }, 600);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      httpRequest()
    );

    //Assert
    expect(httpResult.data).toBeNull();
    expect(httpResult.error).not.toEqual(null);
    expect(httpResult.error?.reason).toBe("retry");
    expect(httpResult.error?.message).toBe(
      "The number of retries (3) has exceeded."
    );
  }, 1200000);

  test("http request completes successfully when no timeout on retries occurs", async () => {
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberRetries: 3,
      retryIntervalStrategy: RetryInterval.Linear_With_Jitter,
      baseSeconds: 0.4,
      timeoutPerRetrySeconds: 1,
    });

    const httpRequest = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("It went well in the first attempt!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      httpRequest()
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

    const httpRequest = () => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject("You shall not pass!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      httpRequest()
    );

    //Assert
    expect(httpResult.data).toBeNull();
    expect(httpResult.error).not.toEqual(null);
    expect(httpResult.error?.reason).toBe("retry");
    expect(httpResult.error?.message).toBe(
      "The number of retries (3) has exceeded."
    );
  }, 1200000);

  test("http request completes successfully when no retries occurs", async () => {
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberRetries: 3,
      retryIntervalStrategy: RetryInterval.Exponential,
    });

    const httpRequest = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("It went well in the first attempt!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      httpRequest()
    );

    //Assert
    expect(httpResult.data).not.toEqual(null);
    expect(httpResult.data).toEqual("It went well in the first attempt!");
  });
});

describe("retry with exponential backoff with timeout on retry", () => {
  test("error thrown when timeout on retries occurs", async () => {
    //Arrange
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberRetries: 3,
      retryIntervalStrategy: RetryInterval.Exponential,
      timeoutPerRetrySeconds: 0.3,
    });

    const httpRequest = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("This would execute well if it weren't for the timeout.");
        }, 600);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      httpRequest()
    );

    //Assert
    expect(httpResult.data).toBeNull();
    expect(httpResult.error).not.toEqual(null);
    expect(httpResult.error?.reason).toBe("retry");
    expect(httpResult.error?.message).toBe(
      "The number of retries (3) has exceeded."
    );
  }, 1200000);

  test("http request completes successfully when no timeout on retries occurs", async () => {
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberRetries: 3,
      retryIntervalStrategy: RetryInterval.Exponential,
      timeoutPerRetrySeconds: 1,
    });

    const httpRequest = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("It went well in the first attempt!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      httpRequest()
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

    const httpRequest = () => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject("You shall not pass!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      httpRequest()
    );

    //Assert
    expect(httpResult.data).toBeNull();
    expect(httpResult.error).not.toEqual(null);
    expect(httpResult.error?.reason).toBe("retry");
    expect(httpResult.error?.message).toBe(
      "The number of retries (3) has exceeded."
    );
  }, 1200000);

  test("http request completes successfully when no retries occurs", async () => {
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberRetries: 3,
      retryIntervalStrategy: RetryInterval.Exponential_With_Jitter,
    });

    const httpRequest = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("It went well in the first attempt!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      httpRequest()
    );

    //Assert
    expect(httpResult.data).not.toEqual(null);
    expect(httpResult.data).toEqual("It went well in the first attempt!");
  });
});

describe("retry with exponential jitter backoff and timeout", () => {
  test("error thrown when timeout on retries occurs", async () => {
    //Arrange
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberRetries: 3,
      retryIntervalStrategy: RetryInterval.Exponential_With_Jitter,
      timeoutPerRetrySeconds: 0.3,
    });

    const httpRequest = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("This would execute well if it weren't for the timeout.");
        }, 600);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      httpRequest()
    );

    //Assert
    expect(httpResult.data).toBeNull();
    expect(httpResult.error).not.toEqual(null);
    expect(httpResult.error?.reason).toBe("retry");
    expect(httpResult.error?.message).toBe(
      "The number of retries (3) has exceeded."
    );
  }, 1200000);

  test("http request completes successfully when no timeout on retries occurs", async () => {
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberRetries: 3,
      retryIntervalStrategy: RetryInterval.Exponential_With_Jitter,
    });

    const httpRequest = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("It went well in the first attempt!");
        }, 300);
      });
    };

    //Act
    const httpResult = await retryPolicyExecutor.ExecutePolicyAsync<string>(
      httpRequest()
    );

    //Assert
    expect(httpResult.data).not.toEqual(null);
    expect(httpResult.data).toEqual("It went well in the first attempt!");
  });
});
