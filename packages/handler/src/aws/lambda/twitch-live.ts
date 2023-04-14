import { APIGatewayProxyHandler } from "aws-lambda";
import { twitchChallenge } from "~/shared";

/**
 * Handler for Twitch Live events.
 */

export const handler: APIGatewayProxyHandler = async ({ body, headers }) => {
	if (!body) return { statusCode: 400, body: "Bad Request" };
	try {
		const data = JSON.parse(body);
		console.log("data", data);
		const challenge = twitchChallenge(headers, data);
		if (challenge) {
			return { statusCode: 200, body: challenge };
		}

		return { statusCode: 200, body: "OK" };
	} catch (error) {
		console.error(error);
		return { statusCode: 500, body: "Internal Server Error" };
	}
};
