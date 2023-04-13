import { APIGatewayProxyHandler } from "aws-lambda";
import { twitchChallenge } from "../shared";

/**
 * Handler for Twitch Live events.
 */

export const handler: APIGatewayProxyHandler = async ({ body, headers }) => {
	if (!body) return { statusCode: 400, body: "Bad Request" };
	const data = JSON.parse(body);
	const challenge = twitchChallenge(headers, data);
	if (challenge) {
		return { statusCode: 200, body: challenge };
	}

	return { statusCode: 200, body: "OK" };
};
