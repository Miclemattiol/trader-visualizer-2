// Module: consts
pub const TRADER_RUNNING_VALUE: &str = "trader_running";
pub const TRADER_NOT_RUNNING_VALUE: &str = "trader_not_running";
pub const TRADER_PAUSED_VALUE: &str = "trader_paused";
pub const TRADER_NOT_PAUSED_VALUE: &str = "trader_not_paused";

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

// Menu buttons
pub const MAIN_SUBMENU_TITLE: &str = "Main";

pub const START_BUTTON_ID: &str = "start";
pub const START_BUTTON_LABEL: &str = "Start";
pub const STOP_BUTTON_LABEL: &str = "Stop";
pub const START_BUTTON_ACCELERATOR : &str = "CmdOrCtrl+R";

pub const PAUSE_BUTTON_ID: &str = "pause";
pub const PAUSE_BUTTON_LABEL: &str = "Pause";
pub const RESUME_BUTTON_LABEL: &str = "Resume";
pub const PAUSE_BUTTON_ACCELERATOR : &str = "CmdOrCtrl+Shift+R";

pub const RESTART_BUTTON_ID: &str = "restart";
pub const RESTART_BUTTON_LABEL: &str = "Restart";
pub const RESTART_BUTTON_ACCELERATOR : &str = "CmdOrCtrl+Shift+Alt+R";