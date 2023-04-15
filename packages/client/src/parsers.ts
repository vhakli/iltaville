export const parseTags = (tags: string[]) => {
	const parsed = tags.reduce((acc, tag) => {
		const [key, value] = tag.split("=");
		acc[key] = value;
		return acc;
	}, {} as Record<string, string>);
	return parsed;
};

export const parseSource = (source: string): Record<string, string | null> | null => {
	if (!source) return null;
	else {
		const sourceParts = source.split("!");
		return {
			nick: sourceParts.length == 2 ? sourceParts[0] : null,
			host: sourceParts.length == 2 ? sourceParts[1] : sourceParts[0],
		};
	}
};

export const parseCommand = (command: string): Record<string, string | boolean> | null => {
	const commandParts = command.split(" ");
	switch (commandParts[0]) {
		case "JOIN":
		case "PART":
		case "NOTICE":
		case "CLEARCHAT":
		case "HOSTTARGET":
		case "PRIVMSG":
			return {
				command: commandParts[0],
				channel: commandParts[1],
			};
		case "PING":
			return {
				command: commandParts[0],
			};
		case "CAP":
			return {
				command: commandParts[0],
				isCapRequestEnabled: commandParts[2] === "ACK" ? true : false,
			};
		case "GLOBALUSERSTATE":
			return {
				command: commandParts[0],
			};
		case "USERSTATE":
		case "ROOMSTATE":
			return {
				command: commandParts[0],
				channel: commandParts[1],
			};
		case "RECONNECT":
			console.log("The Twitch IRC server is about to terminate the connection for maintenance.");
			return {
				command: commandParts[0],
			};
		case "421":
			console.log(`Unsupported IRC command: ${commandParts[2]}`);
			return null;
		case "001": // Logged in (successfully authenticated).
			return {
				command: commandParts[0],
				channel: commandParts[1],
			};
		case "002": // Ignoring all other numeric messages.
		case "003":
		case "004":
		case "353": // Tells you who else is in the chat room you're joining.
		case "366":
		case "372":
		case "375":
		case "376":
			return null;
		default:
			console.log(`\nUnexpected command: ${commandParts[0]}\n`);
			return null;
	}
};

// TODO: WTF?
// export const parseParameters = (parameters: string, command: string) => {
//     const idx = 0
//     const commandParts = rawParametersComponent.slice(idx + 1).trim();
//     const paramsIdx = commandParts.indexOf(' ');

//     if (-1 == paramsIdx) { // no parameters
//         command.botCommand = commandParts.slice(0);
//     }
//     else {
//         command.botCommand = commandParts.slice(0, paramsIdx);
//         command.botCommandParams = commandParts.slice(paramsIdx).trim();
//         // TODO: remove extra spaces in parameters string
//     }

//     return command;
// }
