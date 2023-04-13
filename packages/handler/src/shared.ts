import type { APIGatewayProxyEventHeaders } from "aws-lambda";

export const twitchChallenge = (headers: APIGatewayProxyEventHeaders, data: any) => {
	const MESSAGE_TYPE = "Twitch-Eventsub-Message-Type";
	const MESSAGE_TYPE_VERIFICATION = "webhook_callback_verification";
	return headers[MESSAGE_TYPE] === MESSAGE_TYPE_VERIFICATION ? data.challenge : undefined;
};
