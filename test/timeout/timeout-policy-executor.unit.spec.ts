import { ComplexObject } from "./../@common/models/complex-object";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { PolicyExecutorFactory } from "../../src/@common/policy-executor-factory";
import { createTimedOutRequest } from "../@common/utils/timeout-request-function";

describe("Timeout", () => {
  let axiosMock;

  beforeAll(() => {
    axiosMock = new MockAdapter(axios);

    axiosMock.onGet("/complex").reply(200, {
      name: "Name",
      age: 65,
      address: {
        street: "Street",
        zipCode: "ZCode",
      },
    });
  });

  test("rejection thrown when timeout occurs", async () => {
    //Arrange
    const timeoutPolicyExecutor =
      PolicyExecutorFactory.createTimeoutHttpExecutor({
        timeoutInMilli: 200,
      });

    const httpRequest = createTimedOutRequest(axios.get("/complex"), 600);

    //Act
    const httpResult =
      await timeoutPolicyExecutor.ExecutePolicyAsync<ComplexObject>(
        httpRequest
      );

    //Assert
    expect(httpResult.data).toBeNull();
    expect(httpResult.error).not.toEqual(null);
    expect(httpResult.error?.reason).toBe("timeout");
    expect(httpResult.error?.message).toBe(
      "A timeout has occured. Timeout defined: 200 milliseconds."
    );
  });

  test("rejection thrown when timeout occurs and custom onTimeout function executes", async () => {
    //Arrange
    const timeoutPolicyType = {
      timeoutInMilli: 200,
      onTimeout: () => {},
    };

    const timeoutPolicyExecutor =
      PolicyExecutorFactory.createTimeoutHttpExecutor(timeoutPolicyType);

    const spyOnTimeout = jest.spyOn(timeoutPolicyType, "onTimeout");

    const httpRequest = createTimedOutRequest(axios.get("/complex"), 600);

    //Act
    const httpResult =
      await timeoutPolicyExecutor.ExecutePolicyAsync<ComplexObject>(
        httpRequest
      );

    //Assert
    expect(httpResult.data).toBeNull();
    expect(httpResult.error).not.toEqual(null);
    expect(httpResult.error?.reason).toBe("timeout");
    expect(httpResult.error?.message).toBe(
      "A timeout has occured. Timeout defined: 200 milliseconds."
    );
    expect(spyOnTimeout).toHaveBeenCalledTimes(1);
  });

  test("http request completes successfully when no timeout happens", async () => {
    //Arrange
    const timeoutPolicyExecutor =
      PolicyExecutorFactory.createTimeoutHttpExecutor({
        timeoutInMilli: 500,
      });

    //Act
    const httpResult =
      await timeoutPolicyExecutor.ExecutePolicyAsync<ComplexObject>(
        axios.get("/complex")
      );

    //Assert
    expect(httpResult.data).not.toBeNull();
    expect(JSON.stringify(httpResult.data)).toBe(
      JSON.stringify({
        name: "Name",
        age: 65,
        address: {
          street: "Street",
          zipCode: "ZCode",
        },
      })
    );
    expect(httpResult.error).toBeUndefined();
  });
});
