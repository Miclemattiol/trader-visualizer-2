// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[macro_use]
extern crate lazy_static;
pub mod trader;
pub mod consts;
pub mod data_models;
pub mod commands;

use trader::main::{start, is_running, is_paused, get_currencies, get_markets, reset_currencies, reset_markets, get_strategies, select_strategy};
use commands::settings::{get_day_delay, set_day_delay, get_watched_currencies, set_watched_currency};
use commands::controls::open_in_new_window;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            start, is_running, is_paused, 
            get_day_delay, set_day_delay, 
            get_currencies, get_markets, reset_currencies, reset_markets, 
            get_strategies, select_strategy,
            open_in_new_window,
            get_watched_currencies, set_watched_currency
        ]).enable_macos_default_menu(false)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
