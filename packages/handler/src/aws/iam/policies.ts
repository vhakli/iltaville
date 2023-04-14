import type { Stack } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export const createPolicies = (stack: Stack) => {
	// Twitch related policies
	const TwitchPolicy = {
		getIdAndSecret: new PolicyStatement({
			actions: ["ssm:GetParameters"],
			resources: [stack.formatArn({ service: "ssm", resource: "parameter", resourceName: "twitch-client-*" })],
		}),
	} as const;

	return {
		TwitchPolicy,
	} as const;
};
