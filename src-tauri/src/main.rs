// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[macro_use]
extern crate lazy_static;
pub mod commands;
pub mod consts;
pub mod data_models;
pub mod trader;

use commands::controls::open_in_new_window;
use commands::settings::{
    get_day_delay, get_watched_currencies, set_day_delay, set_watched_currency,
};
use consts::{
    MAIN_SUBMENU_TITLE, PAUSED_VALUE_CHANGED_EVENT, PAUSE_BUTTON_ACCELERATOR, PAUSE_BUTTON_ID,
    PAUSE_BUTTON_LABEL, RESUME_BUTTON_LABEL, RUNNING_VALUE_CHANGED_EVENT, SET_PAUSE_EVENT,
    START_BUTTON_ACCELERATOR, START_BUTTON_ID, START_BUTTON_LABEL, STOP_BUTTON_LABEL,
    TRADER_NOT_RUNNING_VALUE, TRADER_RUNNING_VALUE, RESTART_BUTTON_ID, RESTART_BUTTON_LABEL, RESTART_BUTTON_ACCELERATOR,
};
use tauri::{
    AppHandle, CustomMenuItem, Manager, Menu, Submenu, SystemTray, SystemTrayEvent, SystemTrayMenu,
};
use trader::trader_main::{
    get_currencies, get_markets, get_strategies, is_paused, is_running, reset_currencies,
    reset_markets, select_strategy, start,
};

use crate::consts::{SET_STOP_EVENT, TRADER_NOT_PAUSED_VALUE, TRADER_PAUSED_VALUE};

fn main() {
    let (menu, tray) = create_menu();

    tauri::Builder::default()
        .system_tray(tray)
        .invoke_handler(tauri::generate_handler![
            start,
            is_running,
            is_paused,
            get_day_delay,
            set_day_delay,
            get_currencies,
            get_markets,
            reset_currencies,
            reset_markets,
            get_strategies,
            select_strategy,
            open_in_new_window,
            get_watched_currencies,
            set_watched_currency
        ])
        .setup(|app| {
            start_button_state_updater(app.handle());
            pause_button_state_updater(app.handle());
            Ok(())
        })
        .enable_macos_default_menu(false)
        .on_system_tray_event(|app_handle, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => handle_event(id, app_handle.clone()),

            _ => {}
        })
        .menu(menu)
        .on_menu_event(|event| {
            handle_event(
                event.menu_item_id().to_string(),
                event.window().app_handle(),
            )
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn create_menu () -> (Menu, SystemTray) {
    let start_button = CustomMenuItem::new(START_BUTTON_ID, START_BUTTON_LABEL)
        .accelerator(START_BUTTON_ACCELERATOR);
    let pause_button = CustomMenuItem::new(PAUSE_BUTTON_ID, PAUSE_BUTTON_LABEL)
        .disabled()
        .accelerator(PAUSE_BUTTON_ACCELERATOR);
    let restart_button = CustomMenuItem::new(RESTART_BUTTON_ID, RESTART_BUTTON_LABEL)
        .disabled()
        .accelerator(RESTART_BUTTON_ACCELERATOR);
    let start_button_clone = start_button.clone();
    let pause_button_clone = pause_button.clone();
    let restart_button_clone = restart_button.clone();
    let tray_menu = SystemTrayMenu::new()
        .add_item(start_button)
        .add_item(pause_button)
        .add_item(restart_button);
        
    let main_submenu = Submenu::new(
        MAIN_SUBMENU_TITLE,
        Menu::new()
            .add_item(start_button_clone)
            .add_item(pause_button_clone)
            .add_item(restart_button_clone),
    );
    let menu = Menu::new().add_submenu(main_submenu);
    let tray = SystemTray::new().with_menu(tray_menu);

    return (menu, tray);
}

fn handle_event(id: String, app_handle: AppHandle) {
    match id.as_str() {
        START_BUTTON_ID => {
            println!("Start button clicked");
            if is_running() {
                app_handle.trigger_global(SET_STOP_EVENT, None);
            } else {
                start(app_handle.clone());
            }
        }

        PAUSE_BUTTON_ID => {
            app_handle.trigger_global(SET_PAUSE_EVENT, None);
        }

        RESTART_BUTTON_ID => {
            println!("Restart button clicked");
            std::thread::spawn(move || {
                set_button_enabled(&app_handle, START_BUTTON_ID, false);
                set_button_enabled(&app_handle, PAUSE_BUTTON_ID, false);
                set_button_enabled(&app_handle, RESTART_BUTTON_ID, false);

                let current_thread = std::thread::current();
                let stopped_listener = app_handle.listen_global(RUNNING_VALUE_CHANGED_EVENT, 
                    move |event| {
                        if event.payload().unwrap() == TRADER_NOT_RUNNING_VALUE {
                            current_thread.unpark();
                        }
                    }
                );
                app_handle.trigger_global(SET_STOP_EVENT, None);
                std::thread::park();
                app_handle.unlisten(stopped_listener);
                std::thread::sleep(std::time::Duration::from_millis(100)); // Give time to the front end to clear the plot
                start(app_handle.clone());
                set_button_enabled(&app_handle, START_BUTTON_ID, true);
                set_button_enabled(&app_handle, PAUSE_BUTTON_ID, true);
                set_button_enabled(&app_handle, RESTART_BUTTON_ID, true);
            });
        }

        _ => {}
    }
}

fn start_button_state_updater(app_handle: AppHandle) {
    let app_handle_clone = app_handle.clone();
    app_handle.listen_global(RUNNING_VALUE_CHANGED_EVENT, move |event| {

        let (title, enabled) = match event.payload().unwrap() {
            TRADER_RUNNING_VALUE => (STOP_BUTTON_LABEL, true),
            TRADER_NOT_RUNNING_VALUE => (START_BUTTON_LABEL, false),
            _ => panic!("Invalid value received"),
        };

        app_handle_clone.tray_handle().get_item(START_BUTTON_ID).set_title(title).unwrap();
        set_button_enabled(&app_handle_clone, PAUSE_BUTTON_ID, enabled);
        set_button_enabled(&app_handle_clone, RESTART_BUTTON_ID, enabled);

        app_handle_clone.windows().iter().for_each(|(_, window)| {
            window.menu_handle().get_item(START_BUTTON_ID).set_title(title).unwrap();
        });
    });
}

fn pause_button_state_updater(app_handle: AppHandle) {
    let app_handle_clone = app_handle.clone();
    app_handle.listen_global(PAUSED_VALUE_CHANGED_EVENT, move |event| {

        let title = match event.payload().unwrap() {
            TRADER_PAUSED_VALUE => RESUME_BUTTON_LABEL,
            TRADER_NOT_PAUSED_VALUE => PAUSE_BUTTON_LABEL,
            _ => panic!("Invalid value received"),
        };

        app_handle_clone.tray_handle().get_item(PAUSE_BUTTON_ID).set_title(title).unwrap();

        app_handle_clone.windows().iter().for_each(|(_, window)| {
            window.menu_handle().get_item(PAUSE_BUTTON_ID).set_title(title).unwrap();
        });
        
    });
}

fn set_button_enabled(app_handle: &AppHandle, id: &str, enabled: bool) {
    app_handle.tray_handle().get_item(id).set_enabled(enabled).unwrap();
    app_handle.windows().iter().for_each(|(_, window)| {
        window.menu_handle().get_item(id).set_enabled(enabled).unwrap();
    });
}