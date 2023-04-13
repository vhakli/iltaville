import { App, Stack } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import type { NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import path from "path";

export const stack = new Stack(new App(), "IltavilleStack");

const lambda = (name: string, props?: NodejsFunctionProps) => {
	return new NodejsFunction(stack, name, {
		runtime: Runtime.NODEJS_18_X,
		entry: path.join(__dirname, "lambda", `${name}.ts`),
		bundling: { minify: true },
		...props,
	});
};

lambda("twitch-live");
