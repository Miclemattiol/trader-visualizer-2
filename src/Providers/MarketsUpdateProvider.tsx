import { listen } from "@tauri-apps/api/event";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { CurrencyData, Market, constants } from "../assets/types";
import { invoke } from "@tauri-apps/api/tauri";
import { useTraderRunningState } from "./TraderRunningStateProvider";

type Props = {
    children: ReactNode;
};

type MarketsMap = { [key: string]: CurrencyData[] }; //EDIT

const marketsData = await invoke<MarketsMap>(constants.functions.get_markets);

const MarketsUpdateContext = createContext<MarketsMap>(marketsData);

export const MarketsUpdateProvider = ({ children }: Props) => {

    const [MarketsUpdates, setMarketsUpdates] = useState<MarketsMap>(marketsData);
    const [running] = useTraderRunningState();

    useEffect(() => {
        if (running) {
            invoke<MarketsMap>(constants.functions.get_markets).then(markets => {
                setMarketsUpdates(markets);
            }).catch(err => console.error(err));
        }
    }, [running]);


    useEffect(() => {
        const unlistenUpdate = listen<Market[]>(constants.events.MARKET_UPDATE_EVENT, (event) => {
            setMarketsUpdates((prevMarkets) => {
                const newMarkets = { ...prevMarkets };
                event.payload.forEach((market) => {
                    newMarkets[market.name]?.push(market.currencies);
                });
                return newMarkets;
            });
		});

        const unlistenReset = listen(constants.events.MARKET_RESET_EVENT, () => {
            setMarketsUpdates({});
        });

		return () => {
			unlistenUpdate.then(unlisten => unlisten()).catch(err => console.error(err));
            unlistenReset.then(unlisten => unlisten()).catch(err => console.error(err));
		};
    }, []);
    
    return (
        <MarketsUpdateContext.Provider value={MarketsUpdates}>
            {children}
        </MarketsUpdateContext.Provider>
    );
}

export const useMarketsUpdate = () => useContext(MarketsUpdateContext);
