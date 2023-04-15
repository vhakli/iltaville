import type { Stack } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export const createPolicies = (stack: Stack) => {
	const getIdAndSecret = new PolicyStatement({
		actions: ["ssm:GetParameters"],
		resources: [stack.formatArn({ service: "ssm", resource: "parameter", resourceName: "twitch-client-*" })],
	});
	const getSubscriptionSecret = new PolicyStatement({
		actions: ["ssm:GetParameter"],
		resources: [stack.formatArn({ service: "ssm", resource: "parameter", resourceName: "twitch-subscription-secret" })],
	});

	return {
		getIdAndSecret,
		getSubscriptionSecret,
	} as const;
};
