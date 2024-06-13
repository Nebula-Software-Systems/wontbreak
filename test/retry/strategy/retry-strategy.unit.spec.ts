import { RetryIntervalStrategy } from "../../../src/retry/models/retry-interval-options";
import { computeRetryBackoffForStrategyInMilli } from "../../../src/retry/strategy/retry-backoff-strategy";

describe("retry backoff strategy", () => {
  test("constant", async () => {
    //Arrange
    const constantIncrement = 0;

    //Act
    const backoffTimeFirstTry = computeRetryBackoffForStrategyInMilli(
      RetryIntervalStrategy.Constant,
      1,
      10000
    );

    const backoffTimeSecondTry = computeRetryBackoffForStrategyInMilli(
      RetryIntervalStrategy.Constant,
      2,
      10000
    );

    //Assert
    expect(backoffTimeFirstTry).toBe(10000);
    expect(backoffTimeSecondTry).toBe(10000);
    expect(backoffTimeSecondTry - backoffTimeFirstTry).toBe(constantIncrement);
  });

  test("linear", async () => {
    //Arrange
    const linearIncrement = 10000;

    //Act
    const backoffTimeFirstTry = computeRetryBackoffForStrategyInMilli(
      RetryIntervalStrategy.Linear,
      1,
      10000
    );

    const backoffTimeSecondTry = computeRetryBackoffForStrategyInMilli(
      RetryIntervalStrategy.Linear,
      2,
      10000
    );

    //Assert
    expect(backoffTimeFirstTry).toBe(10000);
    expect(backoffTimeSecondTry).toBe(20000);
    expect(backoffTimeSecondTry - backoffTimeFirstTry).toBe(linearIncrement);
  });

  test("linear with jitter", async () => {
    //Arrange
    const minimumLinearIncrement = 9000;
    const maximumLinearIncrement = 11000;

    //Act
    const backoffTimeFirstTry = computeRetryBackoffForStrategyInMilli(
      RetryIntervalStrategy.Linear_With_Jitter,
      1,
      10000
    );

    const backoffTimeSecondTry = computeRetryBackoffForStrategyInMilli(
      RetryIntervalStrategy.Linear_With_Jitter,
      2,
      10000
    );

    //Assert
    expect(backoffTimeFirstTry).toBeGreaterThan(10000);
    expect(backoffTimeSecondTry).toBeGreaterThan(20000);
    expect(backoffTimeSecondTry - backoffTimeFirstTry).toBeGreaterThanOrEqual(
      minimumLinearIncrement
    );
    expect(backoffTimeSecondTry - backoffTimeFirstTry).toBeLessThanOrEqual(
      maximumLinearIncrement
    );
  });

  test("exponential", async () => {
    //Arrange
    const expectedFirstTryBackoff = Math.pow(2, 1) * 1000;
    const expectedFirstSecondBackoff = Math.pow(2, 2) * 1000;

    //Act
    const backoffTimeFirstTry = computeRetryBackoffForStrategyInMilli(
      RetryIntervalStrategy.Exponential,
      1
    );

    const backoffTimeSecondTry = computeRetryBackoffForStrategyInMilli(
      RetryIntervalStrategy.Exponential,
      2
    );

    //Assert
    expect(backoffTimeFirstTry).toBe(expectedFirstTryBackoff);
    expect(backoffTimeSecondTry).toBe(expectedFirstSecondBackoff);
    expect(backoffTimeSecondTry - backoffTimeFirstTry).toBe(
      expectedFirstSecondBackoff - expectedFirstTryBackoff
    );
  });

  test("exponential with jitter", async () => {
    //Arrange
    const minimumFirstTryBackoff = Math.pow(2, 1) * 1000;
    const minimumSecondTryBackoff = Math.pow(2, 2) * 1000;

    //Act
    const backoffTimeFirstTry = computeRetryBackoffForStrategyInMilli(
      RetryIntervalStrategy.Exponential_With_Jitter,
      1
    );

    const backoffTimeSecondTry = computeRetryBackoffForStrategyInMilli(
      RetryIntervalStrategy.Exponential_With_Jitter,
      2
    );

    //Assert
    expect(backoffTimeFirstTry).toBeGreaterThan(minimumFirstTryBackoff);
    expect(backoffTimeSecondTry).toBeGreaterThan(minimumSecondTryBackoff);
    expect(backoffTimeSecondTry - backoffTimeFirstTry).toBeGreaterThan(
      minimumSecondTryBackoff - minimumFirstTryBackoff - 1000
    );
    expect(backoffTimeSecondTry - backoffTimeFirstTry).toBeLessThan(
      minimumSecondTryBackoff - minimumFirstTryBackoff + 1000
    );
  });
});
