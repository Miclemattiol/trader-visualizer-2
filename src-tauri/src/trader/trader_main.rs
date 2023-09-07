use std::collections::HashMap;
use std::sync::{Mutex, Arc};
use std::vec;

use tauri::{command, Manager, AppHandle, EventHandler};

use crate::commands::settings::SLEEP_TIME;
use crate::consts::{ERROR_EVENT, ERROR_RUNNING, SET_STOP_EVENT, SET_PAUSE_EVENT, PAUSED_VALUE_CHANGED_EVENT, RUNNING_VALUE_CHANGED_EVENT, MARKET_UPDATE_EVENT, DAILY_UPDATE_EVENT, DAILY_RESET_EVENT, ERROR_RESET, TRADER_RUNNING_VALUE, TRADER_NOT_RUNNING_VALUE, TRADER_PAUSED_VALUE, TRADER_NOT_PAUSED_VALUE};
use crate::data_models::market::{Market, CurrencyData, DailyData, DailyCurrencyData, Currency, MarketEvent};

const STRATEGIES: &'static [&'static str] = &["Default", "Prova1", "Prova2", "Prova3", "Prova4", "Prova5", "Prova6"];   // TODO: INSERT STRATEGIES HERE

lazy_static!{
    pub static ref RUNNING: Mutex<bool> = Mutex::new(false);
    pub static ref PAUSED: Mutex<bool> = Mutex::new(false);
    pub static ref MARKETS: Mutex<HashMap<String, Vec<CurrencyData>>> = Mutex::new(HashMap::new());
    pub static ref TRADER_DATA: Mutex<Vec<DailyCurrencyData>> = Mutex::new(vec![]);
    pub static ref SELECTED_STRATEGY: Mutex<usize> = Mutex::new(0);
}

#[command]
pub fn is_running() -> bool {
    *RUNNING.lock().unwrap()
}

fn set_running(running: bool, app: AppHandle) {
    *RUNNING.lock().unwrap() = running;
    app.emit_all(RUNNING_VALUE_CHANGED_EVENT, running).unwrap();
    let run: String = if running { TRADER_RUNNING_VALUE } else { TRADER_NOT_RUNNING_VALUE }.to_string();
    app.trigger_global(RUNNING_VALUE_CHANGED_EVENT, Some(run));
}

#[command]
pub fn is_paused() -> bool {
    *PAUSED.lock().unwrap()
}

fn set_paused(paused: bool, app: AppHandle) {
    *PAUSED.lock().unwrap() = paused;
    app.emit_all(PAUSED_VALUE_CHANGED_EVENT, paused).unwrap();
    let pause: String = if paused { TRADER_PAUSED_VALUE } else { TRADER_NOT_PAUSED_VALUE }.to_string();
    app.trigger_global(PAUSED_VALUE_CHANGED_EVENT, Some(pause));
}

#[command]
pub fn get_currencies() -> Vec<DailyCurrencyData>{
    TRADER_DATA.lock().unwrap().clone()
}

#[command]
pub fn get_markets() -> HashMap<String, Vec<CurrencyData>>{
    MARKETS.lock().unwrap().clone()
}

#[command]  //NOT WORKING YET
pub fn reset_currencies(app_handle: AppHandle){
    if is_running() {
        app_handle.emit_all(ERROR_EVENT, ERROR_RESET).unwrap();
        return;
    }

    TRADER_DATA.lock().unwrap().clear();
    app_handle.emit_all(DAILY_RESET_EVENT, "").unwrap();
}

#[command]  //NOT WORKING YET
pub fn reset_markets(app_handle: AppHandle){
    if is_running() {
        app_handle.emit_all(ERROR_EVENT, ERROR_RESET).unwrap();
        return;
    }

    MARKETS.lock().unwrap().clear();
    app_handle.emit_all(MARKET_UPDATE_EVENT, "").unwrap();
}

#[command]
pub fn get_strategies() -> Vec<String>{
    STRATEGIES.iter().map(|s| s.to_string()).collect()
}

#[command]
pub fn select_strategy(strategy: usize){
    *SELECTED_STRATEGY.lock().unwrap() = strategy;
}

pub fn init_market(markets: Vec<Market>){
    MARKETS.lock().unwrap().clear();
    for market in markets {
        MARKETS.lock().unwrap().insert(market.name, vec![market.currencies]);
    }
}

pub fn init_trader_data(data: DailyCurrencyData){
    TRADER_DATA.lock().unwrap().clear();
    TRADER_DATA.lock().unwrap().push(data);
}

#[command]
pub fn start(app_handle: AppHandle){
    if is_running() {
        app_handle.emit_all(ERROR_EVENT, ERROR_RUNNING).unwrap();
        return;
    }

    std::thread::spawn(move ||{
        let stop = Arc::new(Mutex::new(false));
        let pause = Arc::new(Mutex::new(false));
        let stop_handler = new_stop_listener(std::thread::current(), stop.clone(), app_handle.app_handle());
        let pause_handler = new_pause_listener(std::thread::current(), pause.clone(), app_handle.app_handle());

        //RESET DATA
        MARKETS.lock().unwrap().clear();
        TRADER_DATA.lock().unwrap().clear();

        //SETUP TRADER
        let init_value = 1000000.0;
        MARKETS.lock().unwrap().insert("Market di Manu".to_string(), vec![CurrencyData {eur: init_value, usd: init_value, yen: init_value, yuan: init_value }]);    //TEST
        MARKETS.lock().unwrap().insert("Market di Manu ma di quell'altro Manu".to_string(), vec![CurrencyData {eur: init_value, usd: init_value, yen: init_value, yuan: init_value }]);    //TEST
        MARKETS.lock().unwrap().insert("Market di Yapoco".to_string(), vec![CurrencyData {eur: init_value, usd: init_value, yen: init_value, yuan: init_value }]);    //TEST
        MARKETS.lock().unwrap().insert("Market di Micle il migliore".to_string(), vec![CurrencyData {eur: init_value, usd: init_value, yen: init_value, yuan: init_value }]);    //TEST

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

        println!("Trader started with strategy {}", SELECTED_STRATEGY.lock().unwrap());

        set_running(true, app_handle.app_handle());
        while !*stop.lock().unwrap() {
            //TRADER MAIN LOOP

            // let markets = vec![//TEST
            //     Market { name: "1".to_string(), currencies: CurrencyData { eur: iteration as f64, usd: iteration as f64, yen: iteration as f64, yuan: iteration as f64} },
            //     Market { name: "2".to_string(), currencies: CurrencyData { eur: iteration as f64, usd: iteration as f64, yen: iteration as f64, yuan: iteration as f64} },
            //     Market { name: "3".to_string(), currencies: CurrencyData { eur: iteration as f64, usd: iteration as f64, yen: iteration as f64, yuan: iteration as f64} },
            //     Market { name: "ananas".to_string(), currencies: CurrencyData { eur: iteration as f64, usd: iteration as f64, yen: iteration as f64, yuan: iteration as f64} }
            // ];

            //update markets by increasing the value of each currency by a random number in range from -2000 to 3000
            let mut markets = vec![];
            for (name, currencies) in MARKETS.lock().unwrap().iter() {
                let mut currencies = currencies.last().unwrap().clone();
                currencies.eur += (rand::random::<f64>() * 5000.0) - 2000.0;
                currencies.usd += (rand::random::<f64>() * 5000.0) - 2000.0;
                currencies.yen += (rand::random::<f64>() * 5000.0) - 2000.0;
                currencies.yuan += (rand::random::<f64>() * 5000.0) - 2000.0;
                markets.push(Market { name: name.clone(), currencies });
            }

            markets_update(markets, app_handle.app_handle());//TEST

            //random from 1 to 3
            /*
                0: wait
                1: buy with eur to random currency. Give a random amount >0 and receive the opposite amount + a random percentage from -5 to 10
                2: sell with eur to random currency. Give a random amount >0 and receive the opposite amount + a random percentage from -5 to 10
            */
            let action = rand::random::<u8>() % 3;
            let daily_data = match action {
                0 => DailyData { event: MarketEvent::Wait, amount_given: 0., amount_received: 0., kind_given: Currency::EUR, kind_received: Currency::EUR },
                1 => {
                    let kind_given = Currency::EUR;
                    let amount_given = rand::random::<f64>() * 1000.0;
                    let kind_received = match rand::random::<u8>() % 4 {
                        0 => Currency::EUR,
                        1 => Currency::USD,
                        2 => Currency::YEN,
                        3 => Currency::YUAN,
                        _ => Currency::EUR
                    };
                    let amount_received = amount_given * (1.0 + ((rand::random::<f64>() * 15.0) - 5.0) / 100.0);
                    DailyData { event: MarketEvent::Buy, amount_given, amount_received, kind_given, kind_received }
                },
                2 => {
                    let kind_given = match rand::random::<u8>() % 4 {
                        0 => Currency::EUR,
                        1 => Currency::USD,
                        2 => Currency::YEN,
                        3 => Currency::YUAN,
                        _ => Currency::EUR
                    };
                    let amount_given = rand::random::<f64>() * 1000.0;
                    let kind_received = Currency::EUR;
                    let amount_received = amount_given * (1.0 + ((rand::random::<f64>() * 15.0) - 5.0) / 100.0);
                    DailyData { event: MarketEvent::Sell, amount_given, amount_received, kind_given, kind_received }
                },
                _ => DailyData { event: MarketEvent::Wait, amount_given: 0., amount_received: 0., kind_given: Currency::EUR, kind_received: Currency::EUR }
            };

            //let daily_data = DailyData { event: MarketEvent::Wait, amount_given: 0., amount_received: 0., kind_given: Currency::EUR, kind_received: Currency::EUR };

            daily_update(daily_data, app_handle.app_handle());
            
            if *pause.lock().unwrap() {
                set_paused(true, app_handle.app_handle());
                std::thread::park();
                set_paused(false, app_handle.app_handle());
            }
            let sleep_time = *SLEEP_TIME.lock().unwrap();
            std::thread::sleep(std::time::Duration::from_millis(sleep_time));
        }



        set_running(false, app_handle.app_handle());
        let app = app_handle.app_handle();
        app.unlisten(stop_handler);
        app.unlisten(pause_handler);
    });
}

fn new_stop_listener(thread: std::thread::Thread, stop: Arc<Mutex<bool>>, app_handle: AppHandle) -> EventHandler{
    app_handle.app_handle().listen_global(SET_STOP_EVENT, move |_event| {
        
        *stop.lock().unwrap() = true;
        thread.unpark();
    })
}

fn new_pause_listener(thread: std::thread::Thread, pause: Arc<Mutex<bool>>, app_handle: AppHandle) -> EventHandler{
    app_handle.app_handle().listen_global(SET_PAUSE_EVENT, move |_event| {
        
        if is_paused() {
            *pause.lock().unwrap() = false;
            thread.unpark();
        } else {
            *pause.lock().unwrap() = true;
        }
    })
}

fn daily_update(data: DailyData, app_handle: AppHandle) {
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
    app_handle.emit_all(DAILY_UPDATE_EVENT, daily_data).unwrap();
}

fn markets_update(markets: Vec<Market>, app_handle: AppHandle) {
    let mut market_lock = MARKETS.lock().unwrap();
    for market in markets.clone() {
        let currencies = market_lock.get_mut(&market.name);
        if currencies.is_some() {
            currencies.unwrap().push(market.currencies);
        }
    }
    app_handle.emit_all(MARKET_UPDATE_EVENT, markets).unwrap();
}