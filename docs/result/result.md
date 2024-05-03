## Response structure

Whenever we execute the [_ExecutePolicyAsync_](../../src/@common/policy-executor-interface.ts), we get a custom [response](../../src/@common/result.ts) back.

There are two important fields to have in consideration: _data_ and _error_.

The _data_ field represents the data you get from the API endpoint, with the type you provided when calling _ExecutePolicyAsync_.

The _error_ field represents any errors that might have happened throughout the strategy execution. Errors expected include timeouts, exceeded retry attempts and performing requests when the circuit is opened.