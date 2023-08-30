use std::{sync::Mutex, collections::HashMap};
use crate::data_models::market::Currency;

use tauri::command;

lazy_static!{
    pub static ref SLEEP_TIME: Mutex<u64> = Mutex::new(1000);
    pub static ref WATCHED_CURRENCIES: Mutex<HashMap<Currency, bool>> = Mutex::new(HashMap::from([
        (Currency::EUR, true),
        (Currency::USD, true),
        (Currency::YEN, true),
        (Currency::YUAN, true),
    ]));
}

#[command]
pub fn set_day_delay(time: u64) {
    *SLEEP_TIME.lock().unwrap() = time;
}

#[command]
pub fn get_day_delay() -> u64 {
    *SLEEP_TIME.lock().unwrap()
}

#[command]
pub fn get_watched_currencies() -> HashMap<Currency, bool> {
    WATCHED_CURRENCIES.lock().unwrap().clone()
}

#[command]
pub fn set_watched_currency(currency: Currency, watched: bool) {
    *WATCHED_CURRENCIES.lock().unwrap().get_mut(&currency).unwrap() = watched;
}