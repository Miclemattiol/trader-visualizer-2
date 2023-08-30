import { createContext, useContext, useState } from "react";
import { Currency } from "../assets/types";

type Props = {
    children: React.ReactNode;
};

type WatchedCurrenciesMap = { [key in Currency]: boolean }

const initialWatchedCurrencies = {
    [Currency.EUR]: true,
    [Currency.USD]: true,
    [Currency.YEN]: true,
    [Currency.YUAN]: true,
}

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