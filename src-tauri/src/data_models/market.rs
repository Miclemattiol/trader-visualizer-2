use serde::ser::{Serialize, Serializer, SerializeStruct};


#[derive(Copy)]
pub struct Currencies {
    pub eur: f32,
    pub usd: f32,
    pub yen: f32,
    pub yuan: f32
}

impl Clone for Currencies {
    fn clone(&self) -> Self {
        Currencies {
            eur: self.eur,
            usd: self.usd,
            yen: self.yen,
            yuan: self.yuan
        }
    }
}

impl Serialize for Currencies {
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
    pub currencies: Currencies
}

impl Clone for Market {
    fn clone(&self) -> Self {
        Market {
            name: self.name.clone(),
            currencies: self.currencies.clone()
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