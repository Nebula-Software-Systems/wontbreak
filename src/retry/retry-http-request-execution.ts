import { RetryInterval } from "./retry-interval-options";
import { RetryPolicyType } from "./retry-policy-type";
import { computeRetryBackoffForStrategyInSeconds } from "./strategy/retry-backoff-strategy";

export async function retryHttpRequestExecutionAsync(
  httpRequest: Promise<any>,
  retryPolicyType: RetryPolicyType
) {
  return await retryHttpIteration(httpRequest, 1, retryPolicyType);
}

async function retryHttpIteration(
  httpRequest: Promise<any>,
  currentAttempt: number,
  retryPolicyType: RetryPolicyType
): Promise<any> {
  try {
    return await httpRequest;
  } catch (error) {
    if (currentAttempt <= retryPolicyType.maxNumberRetries) {
      const nextAttempt = currentAttempt + 1;

      const delayIntervalInMs =
        computeRetryBackoffForStrategyInSeconds(
          retryPolicyType.retryIntervalStrategy ??
            RetryInterval.Linear_With_Jitter,
          nextAttempt,
          retryPolicyType.baseSeconds
        ) * 1000;
        
      return retryDelay(
        () => retryHttpIteration(httpRequest, nextAttempt, retryPolicyType),
        delayIntervalInMs
      );
    } else {
      throw new Error(
        `The number of retries (${retryPolicyType.maxNumberRetries}) has exceeded.`
      );
    }
  }
}

const retryDelay = (httpRequest: any, retryDelayInMs: number) =>
  new Promise((resolve) =>
    setTimeout(() => resolve(httpRequest()), retryDelayInMs)
  );
