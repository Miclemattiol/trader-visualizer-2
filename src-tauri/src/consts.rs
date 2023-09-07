// Module: consts
pub const WINDOWS_TITLE: &str = "Trader visualizer";
pub const WINDOWS_NAME_PREFIX: &str = "visualizer-window";
pub const TRADER_RUNNING_VALUE: &str = "trader_running";
pub const TRADER_NOT_RUNNING_VALUE: &str = "trader_not_running";
pub const TRADER_PAUSED_VALUE: &str = "trader_paused";
pub const TRADER_NOT_PAUSED_VALUE: &str = "trader_not_paused";

// Event names
pub const LOG_EVENT: &str = "LOG_EVENT";

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
pub const ERROR_WINDOW_NAME: &str = "Error while opening the window";
pub const ERROR_TAURI: &str = "Error while running tauri application";
pub const ERROR_INVALID_VALUE: &str = "Invalid value";

// Warning messages
pub const WARNING_DAY_DELAY_TOO_LOW: &str = "Day delay is too low, it should be at least 20ms to be safe";

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