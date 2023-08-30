use tauri::AppHandle;

#[tauri::command]
pub async fn open_in_new_window(href: String, app: AppHandle) {
  let window_name = format!("window-{}", rand::random::<u32>());
  
  let docs_window = tauri::WindowBuilder::new(
    &app,
    window_name, /* the unique window label */
    tauri::WindowUrl::External(href.parse().unwrap())
  ).title("Visualizer").build();

  if docs_window.is_err() {
    println!("Error while opening the docs window: {:?}", docs_window);
  }
}