import { Result } from "./result";

export default interface IPolicyExecutor {
  ExecutePolicyAsync<T>(httpRequest: Promise<any>): Promise<Result<T>>;
}
