use std::sync::Mutex;

use tauri::{AppHandle, Manager, command};

use crate::{consts::{ERROR_WINDOW_NAME, WINDOWS_TITLE, WINDOWS_NAME_PREFIX, LOG_EVENT}, data_models::market::Log};

lazy_static! {
  pub static ref LOGS: Mutex<Vec<Log>> = Mutex::new(vec![]);
}

#[command]
pub async fn open_in_new_window(href: String, app: AppHandle) {
  let window_name = format!("{}-{}", WINDOWS_NAME_PREFIX, rand::random::<u32>());
  
  let docs_window = tauri::WindowBuilder::new(
    &app,
    window_name, /* the unique window label */
    tauri::WindowUrl::External(href.parse().unwrap())
  ).title(WINDOWS_TITLE).build();

  if docs_window.is_err() {
    log(Log::new(crate::data_models::market::LogType::Error, ERROR_WINDOW_NAME.to_string()), &app);
  }
}

pub fn log(log: Log, app_handle: &AppHandle) {
  LOGS.lock().unwrap().push(log.clone());
  app_handle.emit_all(LOG_EVENT, log).unwrap();
}

#[command]
pub fn get_logs() -> Vec<Log> {

  let ret = LOGS.lock().unwrap().clone();
  println!("Logs cloned!");
  
  ret
}

#[command]
pub fn set_read_logs(n: usize){
  let mut logs = LOGS.lock().unwrap();
  logs.iter_mut().take(n).for_each(|log| log.read = true);
  logs.retain(|log| !log.read);
}