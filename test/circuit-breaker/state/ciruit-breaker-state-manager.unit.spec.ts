import { CircuitBreakerPolicyType } from "../../../src/circuit-breaker/models/circuit-breaker-policy-type";
import CircuitBreakerStateManager from "../../../src/circuit-breaker/state/ciruit-breaker-state-manager";

describe("circuit state manager", () => {
  test("initial state of circuit is closed", () => {
    //Arrange
    const circuitStateManager = new CircuitBreakerStateManager(
      {} as CircuitBreakerPolicyType
    );
    //Act
    //Assert
    expect(circuitStateManager.isCurrentStateClosed()).toBe(true);
  });

  test("moving from closed to open and then to half-opened should be allowed", () => {
    //Arrange
    const circuitStateManager = new CircuitBreakerStateManager({
      onHalfOpen: () => {},
    } as CircuitBreakerPolicyType);
    //Act
    circuitStateManager.moveStateToOpen();

    //Assert
    expect(circuitStateManager.isCurrentStateOpen()).toBeTruthy();

    //move to half-open
    circuitStateManager.moveStateToHalfOpen();
    expect(circuitStateManager.isCurrentStateHalfOpen()).toBe(true);
  });

  test("moving from closed to open and then to half-opened and then to closed should be allowed", () => {
    //Arrange
    const circuitStateManager = new CircuitBreakerStateManager({
      onHalfOpen: () => {},
    } as CircuitBreakerPolicyType);
    //Act
    circuitStateManager.moveStateToOpen();

    //Assert
    expect(circuitStateManager.isCurrentStateOpen).toBeTruthy();

    //move to half-open
    circuitStateManager.moveStateToHalfOpen();
    expect(circuitStateManager.isCurrentStateHalfOpen()).toBe(true);

    //move to closed
    circuitStateManager.moveStateToClosed();
    expect(circuitStateManager.isCurrentStateClosed()).toBe(true);
  });

  test("moving from closed to open and then to half-opened and then to opened should be allowed", () => {
    //Arrange
    const circuitStateManager = new CircuitBreakerStateManager({
      onHalfOpen: () => {},
    } as CircuitBreakerPolicyType);
    //Act
    circuitStateManager.moveStateToOpen();

    //Assert
    expect(circuitStateManager.isCurrentStateOpen).toBeTruthy();

    //move to half-open
    circuitStateManager.moveStateToHalfOpen();
    expect(circuitStateManager.isCurrentStateHalfOpen()).toBe(true);

    //move to open
    circuitStateManager.moveStateToOpen();
    expect(circuitStateManager.isCurrentStateOpen()).toBe(true);
  });
});
