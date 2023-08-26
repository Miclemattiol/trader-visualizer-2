use std::collections::HashMap;
use std::sync::{Mutex, Arc};
use std::vec;

use tauri::{command, Window, Manager, AppHandle, EventHandler};

use crate::commands::settings::SLEEP_TIME;
use crate::consts::{ERROR_EVENT, ERROR_RUNNING, SET_STOP_EVENT, SET_PAUSE_EVENT, PAUSED_VALUE_CHANGED_EVENT, RUNNING_VALUE_CHANGED_EVENT, MARKET_UPDATE_EVENT};
use crate::data_models::market::{Market, Currencies};


lazy_static!{
    pub static ref RUNNING: Mutex<bool> = Mutex::new(false);
    pub static ref PAUSED: Mutex<bool> = Mutex::new(false);
    pub static ref MARKETS: Mutex<HashMap<String, Vec<Currencies>>> = Mutex::new(HashMap::new());
}

#[command]
pub fn is_running() -> bool {
    *RUNNING.lock().unwrap()
}

fn set_running(running: bool, app: AppHandle) {
    *RUNNING.lock().unwrap() = running;
    app.emit_all(RUNNING_VALUE_CHANGED_EVENT, running).unwrap();
}

#[command]
pub fn is_paused() -> bool {
    *PAUSED.lock().unwrap()
}

fn set_paused(paused: bool, app: AppHandle) {
    *PAUSED.lock().unwrap() = paused;
    app.emit_all(PAUSED_VALUE_CHANGED_EVENT, paused).unwrap();
}


#[command]
pub fn start(window: Window){
    if is_running() {
        window.emit(ERROR_EVENT, ERROR_RUNNING).unwrap();
        return;
    }

    std::thread::spawn(move ||{
        let stop = Arc::new(Mutex::new(false));
        let pause = Arc::new(Mutex::new(false));
        let stop_handler = new_stop_listener(std::thread::current(), stop.clone(), window.clone());
        let pause_handler = new_pause_listener(std::thread::current(), pause.clone(), window.clone());

        //SETUP TRADER
        MARKETS.lock().unwrap().insert("1".to_string(), vec![]);    //TEST
        MARKETS.lock().unwrap().insert("2".to_string(), vec![]);
        MARKETS.lock().unwrap().insert("3".to_string(), vec![]);
        MARKETS.lock().unwrap().insert("4".to_string(), vec![]);



        set_running(true, window.app_handle());
        let mut iteration: u32 = 0;//TEST
        while !*stop.lock().unwrap() {
            //TRADER MAIN LOOP
            println!("Markets update {}", MARKETS.lock().unwrap().get("1").unwrap().len());

            let markets = vec![//TEST
                Market { name: "1".to_string(), currencies: Currencies { eur: iteration as f32, usd: iteration as f32, yen: iteration as f32, yuan: iteration as f32} },
                Market { name: "2".to_string(), currencies: Currencies { eur: iteration as f32, usd: iteration as f32, yen: iteration as f32, yuan: iteration as f32} },
                Market { name: "3".to_string(), currencies: Currencies { eur: iteration as f32, usd: iteration as f32, yen: iteration as f32, yuan: iteration as f32} },
                Market { name: "4".to_string(), currencies: Currencies { eur: iteration as f32, usd: iteration as f32, yen: iteration as f32, yuan: iteration as f32} }
            ];

            markets_update(markets, &window);//TEST
            
            if *pause.lock().unwrap() {
                set_paused(true, window.app_handle());
                std::thread::park();
                set_paused(false, window.app_handle());
            }
            let sleep_time = *SLEEP_TIME.lock().unwrap();
            std::thread::sleep(std::time::Duration::from_millis(sleep_time));
            iteration += 1; //TEST
        }



        set_running(false, window.app_handle());
        let app = window.app_handle();
        app.unlisten(stop_handler);
        app.unlisten(pause_handler);
    });
}

fn new_stop_listener(thread: std::thread::Thread, stop: Arc<Mutex<bool>>, window: Window) -> EventHandler{
    window.app_handle().listen_global(SET_STOP_EVENT, move |_event| {
        
        println!("Stop event received");
        *stop.lock().unwrap() = true;
        thread.unpark();
    })
}

fn new_pause_listener(thread: std::thread::Thread, pause: Arc<Mutex<bool>>, window: Window) -> EventHandler{
    window.app_handle().listen_global(SET_PAUSE_EVENT, move |_event| {
        println!("Pause event received");
        if is_paused() {
            *pause.lock().unwrap() = false;
            thread.unpark();
        } else {
            *pause.lock().unwrap() = true;
        }
    })
}

#[allow(dead_code)] //TODO: REMOVE
fn daily_update() {

}

fn markets_update(markets: Vec<Market>, window: &Window) {
    let mut market_lock = MARKETS.lock().unwrap();
    for market in markets.clone() {
        let currencies = market_lock.get_mut(&market.name);
        if currencies.is_some() {
            currencies.unwrap().push(market.currencies);
        }
    }
    window.emit(MARKET_UPDATE_EVENT, markets.clone()).unwrap();
}