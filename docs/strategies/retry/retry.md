## Retry strategy

To create a retry strategy we need to call our policy factory using the _createRetryHttpExecutor_ method:

```js
const retryPolicyExecutor =
  PolicyExecutorFactory.createRetryHttpExecutor({
    maxNumberOfRetries: 3,
    retryIntervalStrategy: RetryIntervalStrategy.Constant,
    baseRetryDelayInMilli: 300,
  });
```

The _createRetryHttpExecutor_ method takes a [configuration object](../../../src/retry/models/retry-policy-type.ts) to properly configure the retry policy.

Let's take a closer look at the fields.

### maxNumberOfRetries
Reflects the maximum number of retries before a retry error is thrown under the _error_ property on the [result object](../../result/result.md).

The retry interval strategy itself is defined in the _retryIntervalStrategy_ property.


### (optional) retryIntervalStrategy
This property reflects the backoff interval between retries. The default value for this is _Linear With Jitter_.

There are lots of [possible strategies](../../../src/retry/models/retry-interval-options.ts) to choose from.

#### Constant
The retry will happen every X milliseconds, being X defined by the value of milliseconds inserted in the optional property _baseRetryDelayInMilli_.

As an example, if you define _baseRetryDelayInMilli_ as 500, retries are spaced in time in every 500 milliseconds. 

#### Linear
The interval here is computed based on the current retry attempt and the value specified in _baseRetryDelayInMilli_.

The formula is:
```
_baseRetryDelayInMilli_ * next_retry_attempt
```

Let's assume that _baseRetryDelayInMilli_ is 1000.

When we try the request for the second time, and it fails, the next retry will happen after 2000 milliseconds (next_retry_attempt = 2)


#### Linear With Jitter
This is the default strategy if none is provided.

This is pretty much equal to the _Linear_ strategy with the caveat that we add an extra jitter on the backoff. Currently, we don't have allow any external configuration of this jitter.


#### Exponential
To compute this we only use the next retry attempt value.

This is computed based on a power of 2.

For example, if the next retry is retry 2, then we amount of milliseconds that the next retry will happen on is 4000 (2 to the power of 2 times 1000).


#### Exponential With Jitter
This is pretty much the same as the _Exponential_ strategy with the caveat that we add an extra jitter on the backoff.

Currently, we don't have allow any external configuration of this jitter.


### (optional) baseRetryDelayInMilli
This is important when computing the _Constant_, _Linear_ and _Linear with Jitter_ backoff intervals.

This acts as an initial seed for the backoff computations. If no value is specified, the default value of 1000 milliseconds is assumed. 


### (optional) timeoutPerRetryInMilli
You can specify a timeout, in milliseconds, for your requests. Whenever this timeout happens a new retry will be triggered.

If no value is specified, the request will happen normally, meaning until a response is obtained from the server.


### (optional) excludeRetriesOnStatusCodes
Some http status codes retrieved from the server responses don't make sense to retry.

For example, if you get a 404 back now matter how much you try you'll always get 404. Therefore, you must have this in consideration when defining your retry strategy.

If you don't specify anything here, our retry policy blocks retries for all 4XX, except 408.
If you decide to override this default policy, then whenever the status code you provided here happens, a retry will not be allowed and an error is thrown.