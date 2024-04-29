import axios from "axios";
import { PolicyExecutorFactory } from "../../src/@common/policy-executor-factory";
import { RetryIntervalStrategy } from "../../src/retry/models/retry-interval-options";
import { createTimedOutRequest } from "../@common/utils/timeout-request-function";
import { ComplexObject } from "../@common/models/complex-object";
const MockAdapter = require("axios-mock-adapter");

describe("Retry with constant backoff", () => {
  let axiosMock;
  beforeAll(() => {
    axiosMock = new MockAdapter(axios);

    axiosMock.onGet("/complex").reply(200, {
      name: "Name",
      age: 65,
      address: {
        street: "Street",
        zipCode: "ZCode",
      },
    });
  });

  test("error thrown when number of retries exceeds", async () => {
    //Arrange
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberOfRetries: 3,
      retryIntervalStrategy: RetryIntervalStrategy.Constant,
      baseRetryDelayInSeconds: 0.2,
    });

    const httpRequest = () => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject("You shall not pass!");
        }, 300);
      });
    };

    //Act
    const httpResult =
      await retryPolicyExecutor.ExecutePolicyAsync<ComplexObject>(
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
      maxNumberOfRetries: 3,
      retryIntervalStrategy: RetryIntervalStrategy.Constant,
      baseRetryDelayInSeconds: 0.2,
    });

    //Act
    const httpResult =
      await retryPolicyExecutor.ExecutePolicyAsync<ComplexObject>(
        axios.get("/complex")
      );

    //Assert
    expect(httpResult.data).not.toBeNull();
    expect(JSON.stringify(httpResult.data)).toBe(
      JSON.stringify({
        name: "Name",
        age: 65,
        address: {
          street: "Street",
          zipCode: "ZCode",
        },
      })
    );
    expect(httpResult.error).toBeNull();
  });
});

describe("Retry with constant backoff with timeout on retry", () => {
  let axiosMock;
  beforeAll(() => {
    axiosMock = new MockAdapter(axios);

    axiosMock.onGet("/complex").reply(200, {
      name: "Name",
      age: 65,
      address: {
        street: "Street",
        zipCode: "ZCode",
      },
    });
  });

  test("error thrown when timeout occurs on retry", async () => {
    //Arrange
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberOfRetries: 3,
      retryIntervalStrategy: RetryIntervalStrategy.Constant,
      baseRetryDelayInSeconds: 0.2,
      timeoutPerRetryInSeconds: 0.3,
    });

    const httpRequest = createTimedOutRequest(axios.get("/complex"), 0.4);

    //Act
    const httpResult =
      await retryPolicyExecutor.ExecutePolicyAsync<ComplexObject>(httpRequest);

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
      maxNumberOfRetries: 3,
      retryIntervalStrategy: RetryIntervalStrategy.Constant,
      baseRetryDelayInSeconds: 0.2,
      timeoutPerRetryInSeconds: 0.4,
    });

    //Act
    const httpResult =
      await retryPolicyExecutor.ExecutePolicyAsync<ComplexObject>(
        axios.get("/complex")
      );

    //Assert
    expect(httpResult.data).not.toBeNull();
    expect(JSON.stringify(httpResult.data)).toBe(
      JSON.stringify({
        name: "Name",
        age: 65,
        address: {
          street: "Street",
          zipCode: "ZCode",
        },
      })
    );
    expect(httpResult.error).toBeNull();
  });
});

describe("Retry with linear backoff", () => {
  let axiosMock;
  beforeAll(() => {
    axiosMock = new MockAdapter(axios);

    axiosMock.onGet("/complex").reply(200, {
      name: "Name",
      age: 65,
      address: {
        street: "Street",
        zipCode: "ZCode",
      },
    });
  });

  test("error thrown when number of retries exceeds", async () => {
    //Arrange
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberOfRetries: 3,
      retryIntervalStrategy: RetryIntervalStrategy.Linear,
    });

    const httpRequest = () => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject("You shall not pass!");
        }, 300);
      });
    };

    //Act
    const httpResult =
      await retryPolicyExecutor.ExecutePolicyAsync<ComplexObject>(
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
      maxNumberOfRetries: 3,
      retryIntervalStrategy: RetryIntervalStrategy.Linear,
      baseRetryDelayInSeconds: 0.2,
    });

    //Act
    const httpResult =
      await retryPolicyExecutor.ExecutePolicyAsync<ComplexObject>(
        axios.get("/complex")
      );

    //Assert
    expect(httpResult.data).not.toBeNull();
    expect(JSON.stringify(httpResult.data)).toBe(
      JSON.stringify({
        name: "Name",
        age: 65,
        address: {
          street: "Street",
          zipCode: "ZCode",
        },
      })
    );
    expect(httpResult.error).toBeNull();
  });
});

describe("Retry with linear backoff with timeout on retry", () => {
  let axiosMock;
  beforeAll(() => {
    axiosMock = new MockAdapter(axios);

    axiosMock.onGet("/complex").reply(200, {
      name: "Name",
      age: 65,
      address: {
        street: "Street",
        zipCode: "ZCode",
      },
    });
  });

  test("error thrown when timeout on retry occurs", async () => {
    //Arrange
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberOfRetries: 3,
      retryIntervalStrategy: RetryIntervalStrategy.Linear,
      timeoutPerRetryInSeconds: 0.3,
    });

    const httpRequest = createTimedOutRequest(axios.get("/complex"), 0.6);

    //Act
    const httpResult =
      await retryPolicyExecutor.ExecutePolicyAsync<ComplexObject>(httpRequest);

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
      maxNumberOfRetries: 3,
      retryIntervalStrategy: RetryIntervalStrategy.Linear,
      baseRetryDelayInSeconds: 0.2,
      timeoutPerRetryInSeconds: 1,
    });

    //Act
    const httpResult =
      await retryPolicyExecutor.ExecutePolicyAsync<ComplexObject>(
        axios.get("/complex")
      );

    //Assert
    expect(httpResult.data).not.toBeNull();
    expect(JSON.stringify(httpResult.data)).toBe(
      JSON.stringify({
        name: "Name",
        age: 65,
        address: {
          street: "Street",
          zipCode: "ZCode",
        },
      })
    );
    expect(httpResult.error).toBeNull();
  });
});

describe("Retry with linear and jitter backoff", () => {
  let axiosMock;
  beforeAll(() => {
    axiosMock = new MockAdapter(axios);

    axiosMock.onGet("/complex").reply(200, {
      name: "Name",
      age: 65,
      address: {
        street: "Street",
        zipCode: "ZCode",
      },
    });
  });
  test("error thrown when number of retries exceeds", async () => {
    //Arrange
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberOfRetries: 3,
      retryIntervalStrategy: RetryIntervalStrategy.Linear_With_Jitter,
      baseRetryDelayInSeconds: 0.2,
    });

    const httpRequest = () => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject("You shall not pass!");
        }, 300);
      });
    };

    //Act
    const httpResult =
      await retryPolicyExecutor.ExecutePolicyAsync<ComplexObject>(
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
      maxNumberOfRetries: 3,
      retryIntervalStrategy: RetryIntervalStrategy.Linear_With_Jitter,
      baseRetryDelayInSeconds: 0.4,
    });

    //Act
    const httpResult =
      await retryPolicyExecutor.ExecutePolicyAsync<ComplexObject>(
        axios.get("/complex")
      );

    //Assert
    expect(httpResult.data).not.toBeNull();
    expect(JSON.stringify(httpResult.data)).toBe(
      JSON.stringify({
        name: "Name",
        age: 65,
        address: {
          street: "Street",
          zipCode: "ZCode",
        },
      })
    );
    expect(httpResult.error).toBeNull();
  });
});

describe("Retry with linear and jitter backoff with timeout on retry", () => {
  let axiosMock;
  beforeAll(() => {
    axiosMock = new MockAdapter(axios);

    axiosMock.onGet("/complex").reply(200, {
      name: "Name",
      age: 65,
      address: {
        street: "Street",
        zipCode: "ZCode",
      },
    });
  });
  test("error thrown when timeout on retries occurs", async () => {
    //Arrange
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberOfRetries: 3,
      retryIntervalStrategy: RetryIntervalStrategy.Linear_With_Jitter,
      baseRetryDelayInSeconds: 0.2,
      timeoutPerRetryInSeconds: 0.3,
    });

    const httpRequest = createTimedOutRequest(axios.get("/complex"), 0.6);

    //Act
    const httpResult =
      await retryPolicyExecutor.ExecutePolicyAsync<ComplexObject>(httpRequest);

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
      maxNumberOfRetries: 3,
      retryIntervalStrategy: RetryIntervalStrategy.Linear_With_Jitter,
      baseRetryDelayInSeconds: 0.4,
      timeoutPerRetryInSeconds: 1,
    });

    //Act
    const httpResult =
      await retryPolicyExecutor.ExecutePolicyAsync<ComplexObject>(
        axios.get("/complex")
      );

    //Assert
    expect(httpResult.data).not.toBeNull();
    expect(JSON.stringify(httpResult.data)).toBe(
      JSON.stringify({
        name: "Name",
        age: 65,
        address: {
          street: "Street",
          zipCode: "ZCode",
        },
      })
    );
    expect(httpResult.error).toBeNull();
  });
});

describe("Retry with exponential backoff", () => {
  let axiosMock;
  beforeAll(() => {
    axiosMock = new MockAdapter(axios);

    axiosMock.onGet("/complex").reply(200, {
      name: "Name",
      age: 65,
      address: {
        street: "Street",
        zipCode: "ZCode",
      },
    });
  });
  test("error thrown when number of retries exceeds", async () => {
    //Arrange
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberOfRetries: 3,
      retryIntervalStrategy: RetryIntervalStrategy.Exponential,
    });

    const httpRequest = () => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject("You shall not pass!");
        }, 300);
      });
    };

    //Act
    const httpResult =
      await retryPolicyExecutor.ExecutePolicyAsync<ComplexObject>(
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
      maxNumberOfRetries: 3,
      retryIntervalStrategy: RetryIntervalStrategy.Exponential,
    });

    //Act
    const httpResult =
      await retryPolicyExecutor.ExecutePolicyAsync<ComplexObject>(
        axios.get("/complex")
      );

    //Assert
    expect(httpResult.data).not.toBeNull();
    expect(JSON.stringify(httpResult.data)).toBe(
      JSON.stringify({
        name: "Name",
        age: 65,
        address: {
          street: "Street",
          zipCode: "ZCode",
        },
      })
    );
    expect(httpResult.error).toBeNull();
  });
});

describe("Retry with exponential backoff with timeout on retry", () => {
  let axiosMock;
  beforeAll(() => {
    axiosMock = new MockAdapter(axios);

    axiosMock.onGet("/complex").reply(200, {
      name: "Name",
      age: 65,
      address: {
        street: "Street",
        zipCode: "ZCode",
      },
    });
  });
  test("error thrown when timeout on retries occurs", async () => {
    //Arrange
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberOfRetries: 3,
      retryIntervalStrategy: RetryIntervalStrategy.Exponential,
      timeoutPerRetryInSeconds: 0.3,
    });

    const httpRequest = createTimedOutRequest(axios.get("/complex"), 0.6);

    //Act
    const httpResult =
      await retryPolicyExecutor.ExecutePolicyAsync<ComplexObject>(httpRequest);

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
      maxNumberOfRetries: 3,
      retryIntervalStrategy: RetryIntervalStrategy.Exponential,
      timeoutPerRetryInSeconds: 1,
    });

    //Act
    const httpResult =
      await retryPolicyExecutor.ExecutePolicyAsync<ComplexObject>(
        axios.get("/complex")
      );

    //Assert
    expect(httpResult.data).not.toBeNull();
    expect(JSON.stringify(httpResult.data)).toBe(
      JSON.stringify({
        name: "Name",
        age: 65,
        address: {
          street: "Street",
          zipCode: "ZCode",
        },
      })
    );
    expect(httpResult.error).toBeNull();
  });
});

describe("Retry with exponential jitter backoff", () => {
  let axiosMock;
  beforeAll(() => {
    axiosMock = new MockAdapter(axios);

    axiosMock.onGet("/complex").reply(200, {
      name: "Name",
      age: 65,
      address: {
        street: "Street",
        zipCode: "ZCode",
      },
    });
  });
  test("error thrown when number of retries exceeds", async () => {
    //Arrange
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberOfRetries: 3,
      retryIntervalStrategy: RetryIntervalStrategy.Exponential_With_Jitter,
    });

    const httpRequest = () => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject("You shall not pass!");
        }, 300);
      });
    };

    //Act
    const httpResult =
      await retryPolicyExecutor.ExecutePolicyAsync<ComplexObject>(
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
      maxNumberOfRetries: 3,
      retryIntervalStrategy: RetryIntervalStrategy.Exponential_With_Jitter,
    });

    //Act
    const httpResult =
      await retryPolicyExecutor.ExecutePolicyAsync<ComplexObject>(
        axios.get("/complex")
      );

    //Assert
    expect(httpResult.data).not.toBeNull();
    expect(JSON.stringify(httpResult.data)).toBe(
      JSON.stringify({
        name: "Name",
        age: 65,
        address: {
          street: "Street",
          zipCode: "ZCode",
        },
      })
    );
    expect(httpResult.error).toBeNull();
  });
});

describe("Retry with exponential jitter backoff and timeout", () => {
  let axiosMock;
  beforeAll(() => {
    axiosMock = new MockAdapter(axios);

    axiosMock.onGet("/complex").reply(200, {
      name: "Name",
      age: 65,
      address: {
        street: "Street",
        zipCode: "ZCode",
      },
    });
  });
  test("error thrown when timeout on retries occurs", async () => {
    //Arrange
    const retryPolicyExecutor = PolicyExecutorFactory.createRetryHttpExecutor({
      maxNumberOfRetries: 3,
      retryIntervalStrategy: RetryIntervalStrategy.Exponential_With_Jitter,
      timeoutPerRetryInSeconds: 0.3,
    });

    const httpRequest = createTimedOutRequest(axios.get("/complex"), 0.6);

    //Act
    const httpResult =
      await retryPolicyExecutor.ExecutePolicyAsync<ComplexObject>(httpRequest);

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
      maxNumberOfRetries: 3,
      retryIntervalStrategy: RetryIntervalStrategy.Exponential_With_Jitter,
    });

    //Act
    const httpResult =
      await retryPolicyExecutor.ExecutePolicyAsync<ComplexObject>(
        axios.get("/complex")
      );

    //Assert
    expect(httpResult.data).not.toBeNull();
    expect(JSON.stringify(httpResult.data)).toBe(
      JSON.stringify({
        name: "Name",
        age: 65,
        address: {
          street: "Street",
          zipCode: "ZCode",
        },
      })
    );
    expect(httpResult.error).toBeNull();
  });
});
