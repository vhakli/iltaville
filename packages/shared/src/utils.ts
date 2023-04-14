import type { APIGatewayProxyResult } from "aws-lambda";

export const success = <Output>(body: Output) =>
	({
		statusCode: 200,
		body: JSON.stringify(body),
	} as APIGatewayProxyResult);

export const clientError = (message: string) =>
	({
		statusCode: 400,
		body: JSON.stringify({ message }),
	} as APIGatewayProxyResult);

export const serverError = (message: string) =>
	({
		statusCode: 500,
		body: JSON.stringify({ message }),
	} as APIGatewayProxyResult);
