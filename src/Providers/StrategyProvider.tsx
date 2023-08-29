import { invoke } from "@tauri-apps/api";
import { constants } from "../assets/types";
import { createContext, useContext, useState } from "react";

type Props = {
    children: React.ReactNode;
}

const strategies = await invoke<string[]>(constants.functions.get_strategies);

export const StrategyContext = createContext<[string, (strategy: string) => void]>([strategies[0], () => console.error("StrategyContext not initialized")]);

export const StrategyProvider = ({ children }: Props) => {

    const [strategy, _setStrategy] = useState(strategies[0]);

    const setStrategy = async (strategy: string) => {
        const strategyIndex = strategies.indexOf(strategy);
        if (strategyIndex === -1) {
            console.error("Strategy not found");
            return;
        }
        invoke(constants.functions.select_strategy, { strategy: strategyIndex });
        _setStrategy(strategy);
    }

    return (
        <StrategyContext.Provider value={[strategy, setStrategy]}>
            {children}
        </StrategyContext.Provider>
    );
}

export const useStrategy = () => useContext(StrategyContext);

export const getStrategies = () => strategies;