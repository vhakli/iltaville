import { App, Stack } from "aws-cdk-lib";

const { AWS_ACCOUNT } = process.env;
if (!AWS_ACCOUNT) throw new Error("Missing AWS_ACCOUNT environment variable");

new Stack(new App(), "IltavilleDiscordStack", { env: { account: AWS_ACCOUNT, region: "eu-north-1" } });

// API Gateway for receiving webhooks
// new RestApi(stack, "IltavilleTwitchApi", { disableExecuteApiEndpoint: true });

// const lambda = lambdaFactory(stack, __dirname);
