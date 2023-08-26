import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { constants } from "../assets/types";
import { invoke } from "@tauri-apps/api";
import { emit, listen } from "@tauri-apps/api/event";

type Props = {
    children: ReactNode;
};

export type TraderState = {
    running: boolean;
    paused: boolean;
    day_delay: number;
};

const TraderStateContext = createContext<[traderState: TraderState, setTraderState: (traderState: TraderState) => void]>([{paused: false, running: false, day_delay: 1000}, () => console.error("TraderStateContext used without Provider")]);

export const TraderStateProvider = ({ children }: Props) => {
    const [traderState, setTraderState] = useState<TraderState>({paused: false, running: false, day_delay: 1000});

    useEffect(() => {
        console.log("TraderState: ", traderState);
    }, [traderState]);

    useEffect(() => {
        const unlistenRunning = listen<boolean>(constants.events.RUNNING_VALUE_CHANGED_EVENT, (event) => {
            setTraderState( prev => ({...prev, running: event.payload}));
        });

        const unlistenPaused = listen<boolean>(constants.events.PAUSED_VALUE_CHANGED_EVENT, (event) => {
            setTraderState( prev => ({...prev, paused: event.payload}));
        });

        const unlistenDayDelay = listen<number>(constants.events.DAY_DELAY_SET_EVENT_NAME, (event) => {
            setTraderState( prev => ({...prev, day_delay: event.payload}));
        });

        return () => {
            unlistenRunning.then( unlisten => unlisten()).catch( err => console.error(err));
            unlistenPaused.then( unlisten => unlisten()).catch( err => console.error(err));
        }
    }, []);

    return (
        <TraderStateContext.Provider value={[traderState, setTraderState]}>
            {children}
        </TraderStateContext.Provider>
    );
};

export const useTraderState = () => useContext(TraderStateContext);

export const startTrader = () => {
    invoke(constants.functions.START_TRADER);
};

export const stopTrader = () => {
    emit(constants.events.SET_STOP_EVENT);
}

export const pauseTrader = () => {
    emit(constants.events.SET_PAUSE_EVENT);
}