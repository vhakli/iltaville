export interface TwitchEventResponse<Event, Condition> {
	challenge?: string; // Only present when subscribing to the event
	subscription: {
		id: string;
		type: string;
		version: string;
		status: string;
		cost: number;
		created_at: string;
		condition: Condition;
		transport: {
			method: "webhook" | "websocket";
			callback: string;
		};
	};
	event?: Event;
}

export type TwitchStreamOnlineEvent = TwitchEventResponse<
	TwitchStreamOnlineEventBody,
	TwitchStreamOnlineEventCondition
>;

interface TwitchStreamOnlineEventBody {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	type: "live" | "playlist" | "watch_party" | "premiere" | "rerun";
	started_at: string;
}

interface TwitchStreamOnlineEventCondition {
	broadcaster_user_id: string;
}
