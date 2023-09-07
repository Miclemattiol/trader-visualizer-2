import { invoke } from "@tauri-apps/api";
import { createContext, useContext, useEffect, useState } from "react";
import { Log, constants } from "../assets/types";
import { listen } from "@tauri-apps/api/event";

type Props = {
    children: React.ReactNode;
};

const initialLogs = await invoke<Log[]>(constants.functions.get_logs)?? [];

const logsContext = createContext<[Log[], () => number, () => void]>([initialLogs, () => initialLogs.length, () => console.error("DayDelayContext used without Provider")]);

export const LogsProvider = ({ children }: Props) => {
    const [logs, _setLogs] = useState<Log[]>(initialLogs);

    useEffect(() => {
        const logsListener = listen<Log>(constants.events.LOG_EVENT, (event) => {
            _setLogs((logs) => [...logs, event.payload]);
        });

        return () => {
            logsListener.then( unlisten => unlisten() ).catch( err => console.error(err) );
        }
    }, []);

    const readLogs = () => {
        invoke(constants.functions.set_read_logs, { n: logs.length });
        _setLogs(logs => logs.map(log => ({...log, read: true})));
    }

    const unreadedLogs = () => logs.filter(log => !log.read).length;

    return (
        <logsContext.Provider value={[logs, unreadedLogs, readLogs]}>
            {children}
        </logsContext.Provider>
    );
}

export const useLogsContext = () => useContext(logsContext);