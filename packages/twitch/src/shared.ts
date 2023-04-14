import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import type { APIGatewayProxyEvent, APIGatewayProxyEventHeaders } from "aws-lambda";
import crypto from "crypto";
import type { TwitchStreamOnlineEvent } from "./@types/twitch";

const ssmClient = new SSMClient({});

const getTwitchSubscriptionSecret = async () => {
	try {
		const request = await ssmClient.send(
			new GetParameterCommand({ Name: "twitch-subscription-secret", WithDecryption: true })
		);
		const secret = request.Parameter?.Value;
		if (!secret) {
			throw new Error("No secret found");
		}

		return secret;
	} catch (error) {
		console.error(error);
		throw new Error("Failed to get Twitch subscription secret");
	}
};

const getHmacMessage = (event: APIGatewayProxyEvent) => {
	const { body, headers } = event;
	const messageId = headers["Twitch-Eventsub-Message-Id"];
	const timestamp = headers["Twitch-Eventsub-Message-Timestamp"];
	if (!messageId || !timestamp) throw new Error("Missing messageId or timestamp");
	return messageId + timestamp + body;
};

const getHmac = (secret: string, message: string) => {
	return crypto.createHmac("sha256", secret).update(message).digest("hex");
};

export const verifyTwitchSignature = async (event: APIGatewayProxyEvent) => {
	try {
		const secret = await getTwitchSubscriptionSecret();
		const message = getHmacMessage(event);
		const hmac = "sha256=" + getHmac(secret, message);

		const verifySignature = event.headers["Twitch-Eventsub-Message-Signature"];
		if (!verifySignature) return false;

		const validRequest = crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
		if (validRequest) return true;

		return false;
	} catch (error) {
		return false;
	}
};

export const twitchChallenge = (headers: APIGatewayProxyEventHeaders, body: TwitchStreamOnlineEvent) => {
	if (headers["Twitch-Eventsub-Message-Type"] === "webhook_callback_verification") {
		return body.challenge as string;
	}
	return false;
};
