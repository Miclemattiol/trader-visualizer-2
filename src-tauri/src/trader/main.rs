use std::collections::HashMap;
use std::sync::{Mutex, Arc};
use std::vec;

use tauri::{command, Window, Manager, AppHandle, EventHandler};

use crate::commands::settings::SLEEP_TIME;
use crate::consts::{ERROR_EVENT, ERROR_RUNNING, SET_STOP_EVENT, SET_PAUSE_EVENT, PAUSED_VALUE_CHANGED_EVENT, RUNNING_VALUE_CHANGED_EVENT, MARKET_UPDATE_EVENT, DAILY_UPDATE_EVENT, DAILY_RESET_EVENT, ERROR_RESET};
use crate::data_models::market::{Market, CurrencyData, DailyData, DailyCurrencyData, Currency, MarketEvent};


lazy_static!{
    pub static ref RUNNING: Mutex<bool> = Mutex::new(false);
    pub static ref PAUSED: Mutex<bool> = Mutex::new(false);
    pub static ref MARKETS: Mutex<HashMap<String, Vec<CurrencyData>>> = Mutex::new(HashMap::new());
    pub static ref TRADER_DATA: Mutex<Vec<DailyCurrencyData>> = Mutex::new(vec![]);
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
pub fn get_currencies() -> Vec<DailyCurrencyData>{
    TRADER_DATA.lock().unwrap().clone()
}

#[command]
pub fn get_markets() -> HashMap<String, Vec<CurrencyData>>{
    MARKETS.lock().unwrap().clone()
}

#[command]
pub fn reset_currencies(window: Window){
    if is_running() {
        window.emit(ERROR_EVENT, ERROR_RESET).unwrap();
        return;
    }

    TRADER_DATA.lock().unwrap().clear();
    window.emit_all(DAILY_RESET_EVENT, "").unwrap();
}

#[command]
pub fn reset_markets(window: Window){
    if is_running() {
        window.emit(ERROR_EVENT, ERROR_RESET).unwrap();
        return;
    }

    MARKETS.lock().unwrap().clear();
    window.emit_all(MARKET_UPDATE_EVENT, "").unwrap();
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

        //RESET DATA
        MARKETS.lock().unwrap().clear();
        TRADER_DATA.lock().unwrap().clear();

        //SETUP TRADER
        let init_value = 1000000.0;
        MARKETS.lock().unwrap().insert("1".to_string(), vec![CurrencyData {eur: init_value, usd: init_value, yen: init_value, yuan: init_value }]);    //TEST
        MARKETS.lock().unwrap().insert("2".to_string(), vec![CurrencyData {eur: init_value, usd: init_value, yen: init_value, yuan: init_value }]);    //TEST
        MARKETS.lock().unwrap().insert("3".to_string(), vec![CurrencyData {eur: init_value, usd: init_value, yen: init_value, yuan: init_value }]);    //TEST
        MARKETS.lock().unwrap().insert("ananas".to_string(), vec![CurrencyData {eur: init_value, usd: init_value, yen: init_value, yuan: init_value }]);    //TEST

        //INSERT INITIAL CURRENCIES
        let init_value = 1000000.0;
        TRADER_DATA.lock().unwrap().push(
            DailyCurrencyData {
                currencies: CurrencyData { eur: init_value, usd: init_value, yen: init_value, yuan: init_value }, 
                daily_data: DailyData { 
                    event: MarketEvent::Wait, 
                    amount_given: 0., 
                    amount_received: 0., 
                    kind_given: Currency::EUR, 
                    kind_received: Currency::EUR 
                }
            }
        );



        set_running(true, window.app_handle());
        let mut iteration: u32 = 0;//TEST
        while !*stop.lock().unwrap() {
            //TRADER MAIN LOOP

            let markets = vec![//TEST
                Market { name: "1".to_string(), currencies: CurrencyData { eur: iteration as f64, usd: iteration as f64, yen: iteration as f64, yuan: iteration as f64} },
                Market { name: "2".to_string(), currencies: CurrencyData { eur: iteration as f64, usd: iteration as f64, yen: iteration as f64, yuan: iteration as f64} },
                Market { name: "3".to_string(), currencies: CurrencyData { eur: iteration as f64, usd: iteration as f64, yen: iteration as f64, yuan: iteration as f64} },
                Market { name: "ananas".to_string(), currencies: CurrencyData { eur: iteration as f64, usd: iteration as f64, yen: iteration as f64, yuan: iteration as f64} }
            ];

            markets_update(markets, &window);//TEST

            let daily_data = DailyData { event: MarketEvent::Wait, amount_given: 0., amount_received: 0., kind_given: Currency::EUR, kind_received: Currency::EUR };

            daily_update(daily_data, &window);

            println!("Markets update {}", MARKETS.lock().unwrap().get("1").unwrap().len());
            println!("Trader update {}", TRADER_DATA.lock().unwrap().len());
            
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

fn daily_update(data: DailyData, window: &Window) {
    let mut currencies = TRADER_DATA.lock().unwrap().last().unwrap().currencies.clone();
    match data.event {
        MarketEvent::Buy | MarketEvent::Sell => {
            match data.kind_given {
                Currency::EUR => currencies.eur -= data.amount_given,
                Currency::USD => currencies.usd -= data.amount_given,
                Currency::YEN => currencies.yen -= data.amount_given,
                Currency::YUAN => currencies.yuan -= data.amount_given,
            }

            match data.kind_received {
                Currency::EUR => currencies.eur += data.amount_received,
                Currency::USD => currencies.usd += data.amount_received,
                Currency::YEN => currencies.yen += data.amount_received,
                Currency::YUAN => currencies.yuan += data.amount_received,
            }
        },
        _ => {}
    }
    let daily_data = DailyCurrencyData { currencies, daily_data: data };
    TRADER_DATA.lock().unwrap().push(daily_data.clone());
    window.emit_all(DAILY_UPDATE_EVENT, daily_data).unwrap();
}

fn markets_update(markets: Vec<Market>, window: &Window) {
    let mut market_lock = MARKETS.lock().unwrap();
    for market in markets.clone() {
        let currencies = market_lock.get_mut(&market.name);
        if currencies.is_some() {
            currencies.unwrap().push(market.currencies);
        }
    }
    window.emit_all(MARKET_UPDATE_EVENT, markets).unwrap();
}