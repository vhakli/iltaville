import { App, Stack } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import dotenv from "dotenv";
import { createPolicies } from "./aws/iam/policies";
import { createLambda } from "./aws/lambda/main";
import { createNetwork } from "./aws/network";
dotenv.config();

const { AWS_ACCOUNT } = process.env;
if (!AWS_ACCOUNT) throw new Error("Missing AWS_ACCOUNT environment variable");

const stack = new Stack(new App(), "IltavilleStack", { env: { account: AWS_ACCOUNT, region: "eu-north-1" } });

// API Gateway for receiving webhooks
const api = new RestApi(stack, "IltavilleApi", { disableExecuteApiEndpoint: true });

// Utilities
const { TwitchPolicy } = createPolicies(stack);
const lambda = createLambda(stack);
// const network = createNetwork(stack, api);
createNetwork(stack, api);

// Twitch related handlers
const Twitch = {
	liveHandler: lambda("twitch-live"),
} as const;

// Configuring Twitch lambdas
Twitch.liveHandler.addToRolePolicy(TwitchPolicy.getIdAndSecret);
Twitch.liveHandler.addToRolePolicy(TwitchPolicy.getSubscriptionSecret);

const twitchApiResource = api.root.addResource("twitch");
twitchApiResource.addResource("live").addMethod("POST", new LambdaIntegration(Twitch.liveHandler));
