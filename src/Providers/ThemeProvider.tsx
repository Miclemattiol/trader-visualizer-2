import { createContext, ReactNode, useContext, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

type Props = {
    children: ReactNode;
};

export enum Theme {device, dark, light};
export namespace Theme {
    export const values = Object.keys(Theme).flatMap(theme => Number.isNaN(Number(theme)) ? [] : [Number(theme) as Theme]);
}

const ThemeContext = createContext<[theme: Theme, setTheme: (theme: Theme) => void]>([Theme.device, () => console.error("ThemeContext used without Provider")]);

export const ThemeProvider = ({ children }: Props) => {
    const [theme, setTheme] = useLocalStorage<Theme>("theme", Theme.device);

    const getTheme = (): Theme => (theme == Theme.dark || (theme == Theme.device && window.matchMedia("(prefers-color-scheme: dark)").matches)) ? Theme.dark : Theme.light;

    useEffect(() => {
        document.querySelector("html")!.setAttribute("theme", Theme[getTheme()]);
        if (theme == Theme.device) {
            const media = window.matchMedia("(prefers-color-scheme: dark)");

            const checkMediaChange = () => {
                if (theme == Theme.device) {
                    document.querySelector("html")!.setAttribute("theme", Theme[getTheme()]);
                }
            };
            media.addEventListener("change", checkMediaChange);

            return () => media.removeEventListener("change", checkMediaChange);
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={[theme, setTheme]}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);