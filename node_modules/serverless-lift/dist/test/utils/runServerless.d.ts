import type originalRunServerless from "@serverless/test/run-serverless";
import type { AWS } from "@serverless/typescript";
import type { Serverless } from "../../src/types/serverless";
type ComputeLogicalId = (...address: string[]) => string;
type RunServerlessPromiseReturn = ReturnType<typeof originalRunServerless>;
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
type RunServerlessReturn = ThenArg<RunServerlessPromiseReturn>;
declare const computeLogicalId: (serverless: Serverless, ...address: string[]) => string;
export declare const runServerless: (options: Parameters<typeof originalRunServerless>[0]) => Promise<RunServerlessReturn & {
    computeLogicalId: ComputeLogicalId;
}>;
export declare const pluginConfigExt: {
    plugins: string[];
};
export declare const baseConfig: AWS;
export {};
