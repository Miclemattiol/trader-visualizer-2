import { Dispatch, SetStateAction, useEffect, useState } from "react";

function useLocalStorage<T>(key: string, defaultValue: T | (() => T), saveValue = true): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState(() => {
        const calculatedDefaultValue = typeof defaultValue == "function" ? (defaultValue as () => T)() : defaultValue;
        try {
            const value = JSON.parse(localStorage.getItem(key)!) as T;
            return value ?? calculatedDefaultValue;
        }
        catch (_) {
            return calculatedDefaultValue;
        }
    });

    if (saveValue) {
        useEffect(() => {
            localStorage.setItem(key, JSON.stringify(value));
        }, [value]);
    }

    return [value, setValue];
};

export default useLocalStorage;