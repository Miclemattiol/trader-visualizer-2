// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[macro_use]
extern crate lazy_static;
pub mod trader;
pub mod consts;
pub mod data_models;
pub mod commands;

use std::sync::Mutex;

use trader::main::{start, is_running, is_paused};
use commands::settings::{get_sleep_time, set_sleep_time};

lazy_static!{
    pub static ref SLEEP_TIME: Mutex<u64> = Mutex::new(1000);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start, is_running, is_paused, get_sleep_time, set_sleep_time])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

