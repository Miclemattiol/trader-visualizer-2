import { invoke } from "@tauri-apps/api";
import { createContext, useState } from "react";
import { constants } from "../assets/types";

type Props = {
    children: React.ReactNode;
};

const initialDayDelay = await invoke<number>(constants.functions.get_day_delay);

const dayDelayContext = createContext<[number, (newDayDelay: number) => void]>([initialDayDelay, () => console.error("DayDelayContext used without Provider")]);

export const DayDelayProvider = ({ children }: Props) => {
    const [dayDelay, _setDayDelay] = useState<number>(initialDayDelay);

    const setDayDelay = async (newDayDelay: number) => {
        await invoke(constants.functions.set_day_delay, { newDayDelay });
        _setDayDelay(newDayDelay);
    }

    return (
        <dayDelayContext.Provider value={[dayDelay, setDayDelay]}>
            {children}
        </dayDelayContext.Provider>
    );
}