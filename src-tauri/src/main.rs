// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[macro_use]
extern crate lazy_static;
pub mod trader;
pub mod consts;
pub mod data_models;
pub mod commands;

use trader::main::{start, is_running, is_paused};
use commands::settings::{get_day_delay, set_day_delay};



fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start, is_running, is_paused, get_day_delay, set_day_delay])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

