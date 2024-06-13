## Circuit-breaker strategy

To create a circuit-breaker strategy we need to call our policy factory using the _createCircuitBreakerHttpExecutor_ method:

```js
const circuitBreakerPolicyExecutor =
  PolicyExecutorFactory.createCircuitBreakerHttpExecutor({
      maxNumberOfRetriesBeforeCircuitIsOpen: 1,
      retryIntervalStrategy: RetryIntervalStrategy.Constant,
      baseRetryDelayInMilli: 500,
      timeoutPerRetryInMilli: 2000,
      circuitOpenDurationInMilli: 3000,
      onClose: () => console.log("custom close"),
      onHalfOpen: () => console.log("custom half open"),
      onOpen: () => console.log("custom open"),
  });
```

The _createCircuitBreakerHttpExecutor_ method takes a [configuration object](../../../src/circuit-breaker/models/circuit-breaker-policy-type.ts) to properly configure the circuit-breaker policy.

Let's take a closer look at the fields.

### fields to compute retry strategy
The fields mentioned here are: _maxNumberOfRetriesBeforeCircuitIsOpen_, _retryIntervalStrategy_, _baseRetryDelayInMilli_, _timeoutPerRetryInMilli_, _excludeRetriesOnStatusCodes_.

To understand these fields better, please refer to the [retry documentation](../retry/retry.md).

Our circuit-breaker can be enabled by retry policies. The fields mentioned above will configure such retry policies.

If no retry mechanism is wanted, just place _maxNumberOfRetriesBeforeCircuitIsOpen_ as 1 and ignore all the remaining fields.

A note about the _maxNumberOfRetriesBeforeCircuitIsOpen_ property. As the name suggests, after the amount of retries specified here, the circuit will be open and the circuit-breaker state machine will start. If no value is specified here, the default value of 3 will be assumed.

### circuitOpenDurationInMilli
Whenever the maximum amount of retries is reached, the circuit is going from the state _CLOSED_ to the state _OPENED_, and will remaing in such state for the amount of milliseconds specified here.

As long as the circuit remains on this state, all requests made will be automatically rejects, with an error thrown under the _error_ property on the [result object](../../result/result.md).

After _circuitOpenDurationInMilli_, the state will transition to _HALF-OPEN_.

### custom state transition functions
As states change, you might want to provide a custom state changing function. This function must return nothing (be void).

If you wish to add any custom functions for state transitioning, please consider doing so under the optional properties _onOpen_, _onHalfOpen_ and _onClose_.

If nothing is provided in these fields, a simple console.log is done to inform you about states being transitioned.


> [!IMPORTANT]
> To fully achieve the circuit-breaker with our tool, please consider using one circuit-breaker executor per endpoint that you want to manage the circuit state for. Be consistent in using one state machine for a given endpoint.