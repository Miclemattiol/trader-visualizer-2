import { listen } from "@tauri-apps/api/event";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { DailyCurrencyData, constants } from "../assets/types";
import { invoke } from "@tauri-apps/api/tauri";
import { useTraderRunningState } from "./TraderRunningStateProvider";

type Props = {
    children: ReactNode;
};

const dailyCurrencyData: DailyCurrencyData[] = await invoke<DailyCurrencyData[]>(constants.functions.get_currencies);

const TraderDailyUpdateContext = createContext<DailyCurrencyData[]>(dailyCurrencyData);

export const TraderDailyUpdateProvider = ({ children }: Props) => {

    const [TraderDailyUpdates, setTraderDailyUpdates] = useState<DailyCurrencyData[]>(dailyCurrencyData);
    const [running] = useTraderRunningState();

    useEffect(() => {
        if (running) {
            invoke<DailyCurrencyData[]>(constants.functions.get_currencies).then(currencies => {
                setTraderDailyUpdates(currencies);
            }).catch(err => console.error(err));
        }
    }, [running]);


    useEffect(() => {
        const unlistenDaily = listen<DailyCurrencyData>(constants.events.DAILY_UPDATE_EVENT, (event) => {
            setTraderDailyUpdates(prev => [...prev, event.payload]);
		});

        const unlistenReset = listen(constants.events.DAILY_RESET_EVENT, () => {
            setTraderDailyUpdates([]);
        });

		return () => {
			unlistenDaily.then(unlisten => unlisten()).catch(err => console.error(err));
            unlistenReset.then(unlisten => unlisten()).catch(err => console.error(err));
		};
    }, []);
    
    return (
        <TraderDailyUpdateContext.Provider value={TraderDailyUpdates}>
            {children}
        </TraderDailyUpdateContext.Provider>
    );
}

export const useTraderDailyUpdate = () => useContext(TraderDailyUpdateContext);
