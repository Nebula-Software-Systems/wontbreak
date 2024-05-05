<h1 align="center">
  nebula-http-resiliency
</h1>
<p align="center">
  Make your axios requests more resilient.
</p>

[![Coverage Status](https://coveralls.io/repos/github/Nebula-Software-Systems/nebula-http-resiliency/badge.svg?branch=main)](https://coveralls.io/github/Nebula-Software-Systems/nebula-http-resiliency?branch=main)

![NPM Downloads](https://img.shields.io/npm/d18m/nebula-http-resiliency)

## About

nebula-http-resiliency is an Open-Source library that allows you to make your axios requests more resilient.
We provide an implementation for 3 common resiliency algorithms: timeout, retry, and circuit-breaker.

## Install Package
```shell
$ npm install nebula-http-resiliency
```

## Usage

The way of using each strategy is pretty much the same.

The first step is always to choose a specific strategy. In this case let's go with timeout.

```js
const timeoutPolicyExecutor =
  PolicyExecutorFactory.createTimeoutHttpExecutor({
    timeoutInSeconds: 0.2,
  });
```

> [!NOTE]
> For each strategy we must provide a configuration object to specify the constraints of the strategy. More on that on each strategies documentation.


The second step is to execute the http request. We do so by calling the _ExecutePolicyAsync_ method.

```js
const httpResult =
  await timeoutPolicyExecutor.ExecutePolicyAsync<ComplexObject>(
    axios.get("http://nicedocs.com/api/comments")
  );
```

The _ExecutePolicyAsync_ is generic and must be passed on a type, which refers to the expected result from the API endpoint, as well as the axios operation.

> [!NOTE]
> There is no need to use await with the axios operation, as seen in the example above.

For more information on how to properly operate each strategy, please click on the following links: [timeout](docs/strategies/timeout/timeout.md), [retry](docs/strategies/retry/retry.md) and [circuit-breaker](docs/strategies/circuit-breaker/circuit-breaker.md).

For more information on the result type of the _ExecutePolicyAsync_ method, please refer to [this documentation](docs/result/result.md).


## Contributing

This project welcomes and appreciates any contributions made.

There are several ways you can contribute, namely:

- Report any bug found.
- Suggest some features or improvements.
- Creating pull requests.

## License

nebula-http-resiliency is a free and open-source software licensed under the MIT License.

See [LICENSE](LICENSE) for more details.