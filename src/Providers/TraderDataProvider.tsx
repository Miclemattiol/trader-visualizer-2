import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { constants, daylyEvent } from "../assets/types";
import { invoke } from "@tauri-apps/api";
import { emit, listen } from "@tauri-apps/api/event";
import { useTraderState } from "./TraderStateProvider";

type Props = {
    children: ReactNode;
};

export type TraderData = daylyEvent[];

const TraderDataContext = createContext<[TraderData, (traderData: TraderData) => void]>([[], () => console.error("TraderDataContext used without Provider")]);

export const TraderDataProvider = ({ children }: Props) => {
    const [traderData, setTraderData] = useState<TraderData>([]);

    const [traderState] = useTraderState();

    useEffect(() => {

        const unlistenDailyData = listen<daylyEvent>(constants.events.DAYLY_UPDATE_EVENT_NAME, (event) => {
            setTraderData(prev => [...prev, event.payload]);
            console.log("Traderdata: ", traderData);
        });

        return () => {
            unlistenDailyData.then( unlisten => unlisten()).catch( err => console.error(err));
        }
    }, []);

    useEffect(() => {
        if(traderState.running){
            setTraderData([]);
        }
    }, [traderState.running]);

    return (
        <TraderDataContext.Provider value={[traderData, setTraderData]}>
            {children}
        </TraderDataContext.Provider>
    );
};

export const useTraderData = () => useContext(TraderDataContext);

export const startTrader = () => {
    invoke(constants.functions.START_TRADER);
};

export const stopTrader = () => {
    emit(constants.events.SET_STOP_EVENT);
}

export const pauseTrader = () => {
    emit(constants.events.SET_PAUSE_EVENT);
}