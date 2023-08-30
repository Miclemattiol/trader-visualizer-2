import { useState } from "react";
import { useTheme } from "../../Providers/ThemeProvider";
import './ThemeSelector.scss';
import classNames from "classnames";

export const ThemeSelector = () => {

    const [theme] = useTheme();
    const [Active, setActive] = useState(false);

    return (
        <div className={classNames("ThemeSelector", {Active})}>
            <div className="ThemeContainer">
                <span>a</span>
                <span>a</span>
                <span>a</span>
            </div>
            <button className="CurrentTheme" onClick={() => setActive(prev => !prev)}>{theme}</button>
        </div>
    )
}