export const constants = {
	events: {
		ERROR_EVENT: "ERROR_EVENT",
        INFO_EVENT: "INFO_EVENT",
        RUNNING_VALUE_CHANGED_EVENT: "RUNNING_VALUE_CHANGED_EVENT",
        PAUSED_VALUE_CHANGED_EVENT: "PAUSED_VALUE_CHANGED_EVENT",
        SET_STOP_EVENT: "SET_STOP_EVENT",
        SET_PAUSE_EVENT: "SET_PAUSE_EVENT",
        MARKET_UPDATE_EVENT: "MARKET_UPDATE_EVENT",
		MARKET_RESET_EVENT: "MARKET_RESET_EVENT",
        DAILY_UPDATE_EVENT: "DAILY_UPDATE_EVENT",
		DAILY_RESET_EVENT: "DAILY_RESET_EVENT"
	},
	functions: {
		start: "start",
        is_running: "is_running",
        is_paused: "is_paused",
        get_day_delay: "get_day_delay",
        set_day_delay: "set_day_delay",
        get_currencies: "get_currencies",
		get_markets: "get_markets",
		reset_currencies: "reset_currencies",	//NOT WORKING. DO NOT USE
		reset_markets: "reset_markets",			//NOT WORKING. DO NOT USE
		get_strategies: "get_strategies",
		select_strategy: "select_strategy",
	}
}

export interface CurrencyData {
	eur: number,
	usd: number,
	yen: number
	yuan: number
}

export interface Market {
	name: string,
	currencies: CurrencyData
}

export enum Currency {
	EUR = "EUR",
	USD = "USD",
	YEN = "YEN",
	YUAN = "YUAN"
}

export enum MarketEvent {
	Wait = "Wait",
	LockSell = "LockSell",
	LockBuy = "LockBuy",
	Sell = "Sell",
	Buy = "Buy"
}

export interface DailyData {
	event: MarketEvent,
	amount_given: number,
	amount_received: number,
	kind_given: Currency,
	kind_received: Currency,
}

export interface DailyCurrencyData {
	currencies: CurrencyData,
	daily_data: any
}