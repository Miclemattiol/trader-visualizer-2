// Module: consts

// Event names
pub const ERROR_EVENT: &str = "ERROR_EVENT";
pub const INFO_EVENT: &str = "INFO_EVENT";

pub const RUNNING_VALUE_CHANGED_EVENT: &str = "RUNNING_VALUE_CHANGED_EVENT";
pub const PAUSED_VALUE_CHANGED_EVENT: &str = "PAUSED_VALUE_CHANGED_EVENT";
pub const SET_STOP_EVENT: &str = "SET_STOP_EVENT";
pub const SET_PAUSE_EVENT: &str = "SET_PAUSE_EVENT";

pub const MARKET_UPDATE_EVENT: &str = "MARKET_UPDATE_EVENT";
pub const MARKET_RESET_EVENT: &str = "MARKET_RESET_EVENT";
pub const DAILY_UPDATE_EVENT: &str = "DAILY_UPDATE_EVENT";
pub const DAILY_RESET_EVENT: &str = "DAILY_RESET_EVENT";

// Error messages
pub const ERROR_RUNNING: &str = "Trader is already running";
pub const ERROR_RESET: &str = "Trader is running, please stop it first";