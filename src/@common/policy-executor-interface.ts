import { Result } from "./result";

export interface IPolicyExecutor {
  ExecutePolicyAsync<T>(httpRequest: Promise<any>): Promise<Result<T>>;
}
