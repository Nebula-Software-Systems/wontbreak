import { RetryIntervalStrategy } from "../../../src/retry/models/retry-interval-options";
import computeRetryBackoffForStrategyInSeconds from "../../../src/retry/strategy/retry-backoff-strategy";

describe("retry backoff strategy", () => {
  test("constant", async () => {
    //Arrange
    const constantIncrement = 0;

    //Act
    const backoffTimeFirstTry = computeRetryBackoffForStrategyInSeconds(
      RetryIntervalStrategy.Constant,
      1,
      10
    );

    const backoffTimeSecondTry = computeRetryBackoffForStrategyInSeconds(
      RetryIntervalStrategy.Constant,
      2,
      10
    );

    //Assert
    expect(backoffTimeFirstTry).toBe(10);
    expect(backoffTimeSecondTry).toBe(10);
    expect(backoffTimeSecondTry - backoffTimeFirstTry).toBe(constantIncrement);
  });

  test("linear", async () => {
    //Arrange
    const linearIncrement = 10;

    //Act
    const backoffTimeFirstTry = computeRetryBackoffForStrategyInSeconds(
      RetryIntervalStrategy.Linear,
      1,
      10
    );

    const backoffTimeSecondTry = computeRetryBackoffForStrategyInSeconds(
      RetryIntervalStrategy.Linear,
      2,
      10
    );

    //Assert
    expect(backoffTimeFirstTry).toBe(10);
    expect(backoffTimeSecondTry).toBe(20);
    expect(backoffTimeSecondTry - backoffTimeFirstTry).toBe(linearIncrement);
  });

  test("linear with jitter", async () => {
    //Arrange
    const minimumLinearIncrement = 9;
    const maximumLinearIncrement = 11;

    //Act
    const backoffTimeFirstTry = computeRetryBackoffForStrategyInSeconds(
      RetryIntervalStrategy.Linear_With_Jitter,
      1,
      10
    );

    const backoffTimeSecondTry = computeRetryBackoffForStrategyInSeconds(
      RetryIntervalStrategy.Linear_With_Jitter,
      2,
      10
    );

    //Assert
    expect(backoffTimeFirstTry).toBeGreaterThan(10);
    expect(backoffTimeSecondTry).toBeGreaterThan(20);
    expect(backoffTimeSecondTry - backoffTimeFirstTry).toBeGreaterThanOrEqual(
      minimumLinearIncrement
    );
    expect(backoffTimeSecondTry - backoffTimeFirstTry).toBeLessThanOrEqual(
      maximumLinearIncrement
    );
  });

  test("exponential", async () => {
    //Arrange
    const expectedFirstTryBackoff = Math.pow(2, 1);
    const expectedFirstSecondBackoff = Math.pow(2, 2);

    //Act
    const backoffTimeFirstTry = computeRetryBackoffForStrategyInSeconds(
      RetryIntervalStrategy.Exponential,
      1
    );

    const backoffTimeSecondTry = computeRetryBackoffForStrategyInSeconds(
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
    const minimumFirstTryBackoff = Math.pow(2, 1);
    const minimumSecondTryBackoff = Math.pow(2, 2);

    //Act
    const backoffTimeFirstTry = computeRetryBackoffForStrategyInSeconds(
      RetryIntervalStrategy.Exponential_With_Jitter,
      1
    );

    const backoffTimeSecondTry = computeRetryBackoffForStrategyInSeconds(
      RetryIntervalStrategy.Exponential_With_Jitter,
      2
    );

    //Assert
    expect(backoffTimeFirstTry).toBeGreaterThan(minimumFirstTryBackoff);
    expect(backoffTimeSecondTry).toBeGreaterThan(minimumSecondTryBackoff);
    expect(backoffTimeSecondTry - backoffTimeFirstTry).toBeGreaterThan(
      minimumSecondTryBackoff - minimumFirstTryBackoff - 1
    );
    expect(backoffTimeSecondTry - backoffTimeFirstTry).toBeLessThan(
      minimumSecondTryBackoff - minimumFirstTryBackoff + 1
    );
  });
});
