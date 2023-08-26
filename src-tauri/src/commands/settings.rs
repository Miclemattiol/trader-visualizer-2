use std::sync::Mutex;

use tauri::command;

lazy_static!{
    pub static ref SLEEP_TIME: Mutex<u64> = Mutex::new(1000);
}

#[command]
pub fn set_day_delay(time: u64) {
    *SLEEP_TIME.lock().unwrap() = time;
}

#[command]
pub fn get_day_delay() -> u64 {
    *SLEEP_TIME.lock().unwrap()
}