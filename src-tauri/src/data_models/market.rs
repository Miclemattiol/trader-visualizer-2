use serde::ser::{Serialize, SerializeStruct, Serializer};

#[derive(Copy)]
pub struct CurrencyData {
    pub eur: f64,
    pub usd: f64,
    pub yen: f64,
    pub yuan: f64,
}

impl Clone for CurrencyData {
    fn clone(&self) -> Self {
        CurrencyData {
            eur: self.eur,
            usd: self.usd,
            yen: self.yen,
            yuan: self.yuan,
        }
    }
}

impl Serialize for CurrencyData {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut state = serializer.serialize_struct("Market", 4)?;
        state.serialize_field("eur", &self.eur)?;
        state.serialize_field("usd", &self.usd)?;
        state.serialize_field("yen", &self.yen)?;
        state.serialize_field("yuan", &self.yuan)?;
        state.end()
    }
}

pub struct Market {
    pub name: String,
    pub currencies: CurrencyData,
}

impl Clone for Market {
    fn clone(&self) -> Self {
        Market {
            name: self.name.clone(),
            currencies: self.currencies.clone(),
        }
    }
}

impl Serialize for Market {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut state = serializer.serialize_struct("Market", 2)?;
        state.serialize_field("name", &self.name)?;
        state.serialize_field("currencies", &self.currencies)?;
        state.end()
    }
}

#[derive(serde::Serialize, Clone, Copy)]
pub enum Currency {
    EUR,
    USD,
    YEN,
    YUAN,
}

#[derive(serde::Serialize, Clone, Copy)]
pub enum MarketEvent {
    Wait,
    LockSell,
    LockBuy,
    Sell,
    Buy,
}

pub struct DailyData {
    pub event: MarketEvent,
    pub amount_given: f64,
    pub amount_received: f64,
    pub kind_given: Currency,
    pub kind_received: Currency,
}

impl Serialize for DailyData {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut state = serializer.serialize_struct("DailyData", 5)?;
        state.serialize_field("event", &self.event)?;
        state.serialize_field("amount_given", &self.amount_given)?;
        state.serialize_field("amount_received", &self.amount_received)?;
        state.serialize_field("kind_given", &self.kind_given)?;
        state.serialize_field("kind_received", &self.kind_received)?;
        state.end()
    }
}

impl Clone for DailyData {
    fn clone(&self) -> Self {
        DailyData {
            event: self.event.clone(),
            amount_given: self.amount_given,
            amount_received: self.amount_received,
            kind_given: self.kind_given.clone(),
            kind_received: self.kind_received.clone(),
        }
    }
}

pub struct DailyCurrencyData {
    pub currencies: CurrencyData,
    pub daily_data: DailyData,
}

impl Serialize for DailyCurrencyData {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut state = serializer.serialize_struct("DailyCurrencyData", 2)?;
        state.serialize_field("currencies", &self.currencies)?;
        state.serialize_field("daily_data", &self.daily_data)?;
        state.end()
    }
}

impl Clone for DailyCurrencyData {
    fn clone(&self) -> Self {
        DailyCurrencyData {
            currencies: self.currencies.clone(),
            daily_data: self.daily_data.clone(),
        }
    }
}