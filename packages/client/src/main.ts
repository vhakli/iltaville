import dotenv from "dotenv";
import { WebSocket } from "ws";
import { parseCommand, parseSource, parseTags } from "./parsers";
dotenv.config();

const { TWITCH_TOKEN } = process.env;
if (!TWITCH_TOKEN) throw new Error("Missing TWITCH_TOKEN environment variable");

const ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

ws.on("error", console.error);

ws.on("open", () => {
	console.log("connected");
	ws.send(`PASS oauth:${TWITCH_TOKEN}`);
	ws.send("NICK iltaville");
	ws.send("CAP REQ :twitch.tv/commands twitch.tv/tags twitch.tv/membership");
	ws.send("JOIN #villeis");
});

ws.on("message", (data) => {
	const message = data.toString();
	const messages = message.split("\r\n");
	messages.forEach(handleMessage);
});

interface ParsedMessage {
	tags: Record<string, string>;
	source: Record<string, string | null> | null;
	command: Record<string, string | boolean> | null;
	parameters: string | null;
}

function handleMessage(message: string) {
	if (!message) return;
	const parsedMessage = {
		tags: {},
		source: {},
		command: {},
		parameters: null,
	} as ParsedMessage;

	let idx = 0;

	if (message[idx] === "@") {
		const endIdx = message.indexOf(" ");
		const tags = message.split(";");
		parsedMessage.tags = parseTags(tags);
		idx = endIdx + 1;
	}

	if (message[idx] === ":") {
		idx += 1;
		const endIdx = message.indexOf(" ", idx);
		const source = message.slice(idx, endIdx);
		parsedMessage.source = parseSource(source);
		idx = endIdx + 1;
	}

	let endIdx = message.indexOf(":", idx);
	if (-1 == endIdx) {
		endIdx = message.length;
	}

	const command = message.slice(idx, endIdx).trim();
	parsedMessage.command = parseCommand(command);

	if (endIdx != message.length) {
		idx = endIdx + 1;
		const parameters = message.slice(idx);
		console.log("parameters:", parameters);
	}

	// console.log("parsedMessage:", parsedMessage);
	console.log("-----");
}
