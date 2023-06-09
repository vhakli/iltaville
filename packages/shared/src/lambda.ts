import type { Stack } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import type { NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import path from "path";

export const lambdaFactory = (stack: Stack, dir: string) => {
	return (name: string, props?: NodejsFunctionProps) => {
		return new NodejsFunction(stack, name, {
			runtime: Runtime.NODEJS_18_X,
			entry: path.join(dir, "aws/lambda", `${name}.ts`),
			bundling: { minify: true },
			logRetention: RetentionDays.ONE_MONTH,
			...props,
		});
	};
};
