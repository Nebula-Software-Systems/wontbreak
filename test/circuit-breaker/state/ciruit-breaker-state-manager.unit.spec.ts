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

  test("moving from closed to half-opened should not be allowed", () => {
    //Arrange
    const circuitStateManager = new CircuitBreakerStateManager({
      onHalfOpen: () => {},
    } as CircuitBreakerPolicyType);

    //Act

    //Assert
    expect(() => {
      circuitStateManager.moveStateToHalfOpen();
    }).toThrow(Error);
    expect(() => {
      circuitStateManager.moveStateToHalfOpen();
    }).toThrow("The state change from closed to half-open is not allowed.");
  });

  test("moving from closed to opened and then to closed should not be allowed", () => {
    //Arrange
    const circuitStateManager = new CircuitBreakerStateManager({
      onHalfOpen: () => {},
    } as CircuitBreakerPolicyType);

    //Act
    circuitStateManager.moveStateToOpen();

    //Assert
    expect(() => {
      circuitStateManager.moveStateToClosed();
    }).toThrow(Error);
    expect(() => {
      circuitStateManager.moveStateToClosed();
    }).toThrow("The state change from opened to closed is not allowed.");
  });
});
