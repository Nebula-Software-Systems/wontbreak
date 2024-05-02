import { RetryIntervalStrategy } from "../../retry/models/retry-interval-options";

export type CircuitBreakerPolicyType = {
  maxNumberOfRetriesBeforeCircuitIsOpen: number;
  retryIntervalStrategy?: RetryIntervalStrategy;
  baseRetryDelayInSeconds?: number;
  timeoutPerRetryInSeconds?: number;
  excludeRetriesOnStatusCodes?: number[];
  circuitOpenDurationInSeconds: number;
  onOpen?: () => void;
  onHalfOpen?: () => void;
  onClose?: () => void;
};
