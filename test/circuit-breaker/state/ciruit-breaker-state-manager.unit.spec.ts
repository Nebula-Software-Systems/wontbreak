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
    expect(circuitStateManager.isCurrentStateClosed).toBeTruthy();
  });

  test("moving from closed to open", () => {
    //Arrange
    const circuitStateManager = new CircuitBreakerStateManager({
      onHalfOpen: () => {},
    } as CircuitBreakerPolicyType);
    //Act
    circuitStateManager.moveStateToOpen();

    //Assert
    expect(circuitStateManager.isCurrentStateOpen).toBeTruthy();
  });

  test("moving from closed to half", () => {
    //Arrange
    const circuitStateManager = new CircuitBreakerStateManager({
      onHalfOpen: () => {},
    } as CircuitBreakerPolicyType);
    //Act
    circuitStateManager.moveStateToHalfOpen();

    //Assert
    expect(circuitStateManager.isCurrentStateHalfOpen).toBeTruthy();
  });

  test("moving from closed to half and then to closed", () => {
    //Arrange
    const circuitStateManager = new CircuitBreakerStateManager({
      onHalfOpen: () => {},
    } as CircuitBreakerPolicyType);
    //Act
    circuitStateManager.moveStateToHalfOpen();
    circuitStateManager.moveStateToOpen();

    //Assert
    expect(circuitStateManager.isCurrentStateClosed).toBeTruthy();
  });
});
