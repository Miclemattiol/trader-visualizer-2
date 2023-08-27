import { emit, listen } from "@tauri-apps/api/event";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { constants } from "../assets/types";
import { invoke } from "@tauri-apps/api/tauri";

type Props = {
    children: ReactNode;
};

const running = await invoke<boolean>(constants.functions.is_running);

const TraderRunningStateContext = createContext<[boolean, (newTraderRunningState: boolean) => void]>([running, () => console.error("TraderRunningStateContext used without Provider")]);

export const TraderRunningStateProvider = ({ children }: Props) => {

    const [TraderRunningState, _setTraderRunningState] = useState<boolean>(running);

    const setTraderRunningState = async (newTraderRunningState: boolean) => {
        if (newTraderRunningState == TraderRunningState) return;
        if (newTraderRunningState) await invoke(constants.functions.start, { newTraderRunningState });
        else emit(constants.events.SET_STOP_EVENT, {});
    }

    useEffect(() => {
        const unlistenRunning = listen<boolean>(constants.events.RUNNING_VALUE_CHANGED_EVENT, (event) => {
            _setTraderRunningState(event.payload);
        });

        return () => {
            unlistenRunning.then(unlisten => unlisten()).catch(err => console.error(err));
        };
    }, []);
    
    return (
        <TraderRunningStateContext.Provider value={[TraderRunningState, setTraderRunningState]}>
            {children}
        </TraderRunningStateContext.Provider>
    );
}

export const useTraderRunningState = () => useContext(TraderRunningStateContext);