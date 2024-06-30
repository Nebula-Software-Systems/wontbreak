## Timeout strategy

To create a timeout strategy we need to call our policy factory using the _createTimeoutHttpExecutor_ method:

```js
const timeoutPolicyExecutor =
  PolicyExecutorFactory.createTimeoutHttpExecutor({
    timeoutInMilli: 200,
    onTimeout: () => {
      console.log("A timeout has occurred.")
    }
  });
```

The _createTimeoutHttpExecutor_ method takes a [configuration object](../../../src/timeout/models/timeout-policy-type.ts)  to properly configure the timeout policy.

### timeoutInMilli
Whenever your request takes longer than the quantity specified in this property, a timeout error will be thrown under the _error_ property on the [result object](../../result/result.md).

### (optional) onTimeout
Whenever a timeout occurs, this callback is executed.