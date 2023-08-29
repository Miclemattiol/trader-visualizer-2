use tauri::AppHandle;

#[tauri::command]
async fn open_in_new_window(red: String, app: AppHandle) {
  let docs_window = tauri::WindowBuilder::new(
    &app,
    "external", /* the unique window label */
    tauri::WindowUrl::External("https://tauri.app/".parse().unwrap())
  ).build().unwrap();
}