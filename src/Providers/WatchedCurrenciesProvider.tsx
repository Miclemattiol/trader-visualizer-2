import { createContext, useContext, useState } from "react";
import { Currency, constants } from "../assets/types";
import { invoke } from "@tauri-apps/api";

type Props = {
    children: React.ReactNode;
};

const watchedCurrencies: Map<Currency, boolean> = new Map<Currency, boolean>();
watchedCurrencies.set(Currency.EUR, true);
watchedCurrencies.set(Currency.USD, true);
watchedCurrencies.set(Currency.YEN, true);
watchedCurrencies.set(Currency.YUAN, true);

type WatchedCurrenciesMap = { [key in Currency]: boolean }

const initialWatchedCurrencies = await invoke<WatchedCurrenciesMap>(constants.functions.get_watched_currencies);

const watchedCurrencyContext = createContext<[WatchedCurrenciesMap, (currency: Currency, active: boolean) => void]>([initialWatchedCurrencies, () => console.error("WatchedCurrencyProvider not initialized")]);

export const WatchedCurrenciesProvider = ({ children }: Props) => {

    const [watchedCurrencies, _setWatchedCurrencies] = useState<WatchedCurrenciesMap>(initialWatchedCurrencies);

    const setWatchedCurrencies = (currency: Currency, active: boolean) => {
        _setWatchedCurrencies(prev => {
            const newWatchedCurrencies = { ...prev };
            newWatchedCurrencies[currency] = active;
            return newWatchedCurrencies;
        });
    }

    return (
        <watchedCurrencyContext.Provider value={[watchedCurrencies, setWatchedCurrencies]}>
            {children}
        </watchedCurrencyContext.Provider>
    );
}

export const useWatchedCurrencies = () => useContext(watchedCurrencyContext);