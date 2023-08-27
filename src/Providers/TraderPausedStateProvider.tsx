import { emit, listen } from "@tauri-apps/api/event";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { constants } from "../assets/types";
import { invoke } from "@tauri-apps/api/tauri";

type Props = {
    children: ReactNode;
};

const paused = await invoke<boolean>(constants.functions.is_paused);

const TraderPausedStateContext = createContext<[boolean, (newTraderPauseState: boolean) => void]>([paused, () => console.error("TraderPausedStateContext used without Provider")]);

export const TraderPausedStateProvider = ({ children }: Props) => {

    const [TraderPausedState, _setTraderPausedState] = useState<boolean>(paused);

    const setTraderPausedState = (newTraderPausedState: boolean) => {
        if (newTraderPausedState == TraderPausedState) return;
        emit(constants.events.SET_PAUSE_EVENT, {});
    }

    useEffect(() => {
        const unlistenPaused = listen<boolean>(constants.events.PAUSED_VALUE_CHANGED_EVENT, (event) => {
            _setTraderPausedState(event.payload);
        });

        return () => {
            unlistenPaused.then(unlisten => unlisten()).catch(err => console.error(err));
        };
    }, []);
    
    return (
        <TraderPausedStateContext.Provider value={[TraderPausedState, setTraderPausedState]}>
            {children}
        </TraderPausedStateContext.Provider>
    );
}

export const useTraderPausedState = () => useContext(TraderPausedStateContext);