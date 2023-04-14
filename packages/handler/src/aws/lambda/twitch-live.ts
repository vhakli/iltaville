import { APIGatewayProxyHandler } from "aws-lambda";
import type { TwitchStreamOnlineEvent } from "~/@types/twitch";
import { clientError, serverError, success, twitchChallenge, verifyTwitchSignature } from "~/shared";

/**
 * Handler for Twitch Live events.
 */

export const handler: APIGatewayProxyHandler = async (request) => {
	try {
		const validRequest = await verifyTwitchSignature(request);
		if (!validRequest) return clientError("Bad request");

		if (!request.body) return clientError("Bad request");
		const body = JSON.parse(request.body) as TwitchStreamOnlineEvent;

		const challenge = twitchChallenge(request.headers, body);
		if (challenge) return { statusCode: 200, body: challenge };

		return success({ message: "OK" });
	} catch (error) {
		console.error(error);
		return serverError("Internal server error");
	}
};
