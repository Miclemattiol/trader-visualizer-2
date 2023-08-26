import { invoke } from "@tauri-apps/api";

export type daylyEvent = [
	eur: number,
	usd: number,
	yen: number,
	yuan: number,
	eventCode: number,
	kindGiven: number,
	kindReceived: number
];

export type CurrenciesData = {
	eur: number,
	usd: number,
	yen: number,
	yuan: number
}

export const constants = {
	events: {
		ERROR_EVENT: "ERROR_EVENT",
		RUNNING_VALUE_CHANGED_EVENT: "RUNNING_VALUE_CHANGED_EVENT",
		PAUSED_VALUE_CHANGED_EVENT: "PAUSED_VALUE_CHANGED_EVENT",

		SET_STOP_EVENT: "SET_STOP_EVENT",
		SET_PAUSE_EVENT: "SET_PAUSE_EVENT",

		MARKET_UPDATE_EVENT: "MARKET_UPDATE_EVENT",
		DAYLY_UPDATE_EVENT_NAME: "dailyUpdateEvent",
		DAY_DELAY_SET_EVENT_NAME: "dayDelaySetEvent"
	},
	functions: {
		START_TRADER: "start",
		IS_RUNNING: "is_running",
		IS_PAUSED: "is_paused",
		GET_DAY_DELAY: "get_day_delay",
		SET_DAY_DELAY: "set_day_delay",
		GET_CURRENCIES: "get_currencies",
	}
}