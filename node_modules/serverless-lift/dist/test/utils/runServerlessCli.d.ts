export declare function runServerlessCli({ command, fixture }: RunServerlessCliOptions): Promise<RunServerlessCliReturn>;
type RunServerlessCliOptions = {
    fixture: string;
    command: string;
};
type RunServerlessCliReturn = {
    stdoutData: string;
    cfTemplate: {
        Resources: Record<string, unknown>;
        Outputs: Record<string, unknown>;
    };
};
export {};
