use tauri::{AppHandle, Manager};

use crate::consts::{ERROR_EVENT, ERROR_WINDOW_NAME, WINDOWS_TITLE, WINDOWS_NAME_PREFIX};

#[tauri::command]
pub async fn open_in_new_window(href: String, app: AppHandle) {
  let window_name = format!("{}-{}", WINDOWS_NAME_PREFIX, rand::random::<u32>());
  
  let docs_window = tauri::WindowBuilder::new(
    &app,
    window_name, /* the unique window label */
    tauri::WindowUrl::External(href.parse().unwrap())
  ).title(WINDOWS_TITLE).build();

  if docs_window.is_err() {
    app.emit_all(ERROR_EVENT, ERROR_WINDOW_NAME).unwrap();
  }
}