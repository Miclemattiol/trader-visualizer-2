use tauri::command;
use crate::SLEEP_TIME;

#[command]
pub fn set_sleep_time(time: u64) {
    *SLEEP_TIME.lock().unwrap() = time;
}

#[command]
pub fn get_sleep_time() -> u64 {
    *SLEEP_TIME.lock().unwrap()
}