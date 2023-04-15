import { lambdaFactory } from "@villehx/iv-shared";
import { App, Stack } from "aws-cdk-lib";
import { BasePathMapping, DomainName, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import dotenv from "dotenv";
import { createPolicies } from "./aws/iam/policies";
dotenv.config({ path: `${__dirname}/../../../.env` });

const { AWS_ACCOUNT, DOMAIN_NAME, HOSTED_ZONE } = process.env;
if (!AWS_ACCOUNT || !DOMAIN_NAME || !HOSTED_ZONE) throw new Error("Missing AWS_ACCOUNT environment variable");

const stack = new Stack(new App(), "IltavilleTwitchStack", { env: { account: AWS_ACCOUNT, region: "eu-north-1" } });

// API Gateway for receiving webhooks
const api = new RestApi(stack, "IltavilleTwitchApi", { disableExecuteApiEndpoint: true });

// Utilities
const { getIdAndSecret, getSubscriptionSecret } = createPolicies(stack);
const lambda = lambdaFactory(stack, __dirname);

// Twitch related handlers
const liveHandler = lambda("live");

// Configuring Twitch lambdas
liveHandler.addToRolePolicy(getIdAndSecret);
liveHandler.addToRolePolicy(getSubscriptionSecret);

const { root } = api;
root.addResource("live").addMethod("POST", new LambdaIntegration(liveHandler));

const zone = HostedZone.fromLookup(stack, "hostedzone", { domainName: HOSTED_ZONE });

new BasePathMapping(stack, "ApiBasePath", {
	restApi: api,
	domainName: DomainName.fromDomainNameAttributes(stack, "TwitchDomain", {
		domainName: DOMAIN_NAME,
		domainNameAliasHostedZoneId: zone.hostedZoneId,
		domainNameAliasTarget: api.url,
	}),
	basePath: "twitch",
});
