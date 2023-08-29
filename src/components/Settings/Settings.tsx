import { MdSettings } from "react-icons/md";
import './Settings.scss';
import classNames from "classnames";
import { useRef, useState } from "react";
import { Checkbox } from "./InputTiles/Checkbox/Checkbox";
import { useTheme, Theme } from "../../Providers/ThemeProvider";
import { SubMenu } from "./SubMenu/SubMenu";
import { useOutsideAlerter } from "../../hooks/useOutsideAlterer";
import { InputTile } from "./InputTiles/InputTile/InputTile";
import { getStrategies, useStrategy } from "../../Providers/StrategyProvider";
import { useDayDelay } from "../../Providers/DayDelayProvider";

declare global {
    interface String {
        capitalize(): string;
    }
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

export const SettingsButton = () => {
    const [Active, setActive] = useState(false);
    const [theme, setTheme] = useTheme();
    const strategies = getStrategies();
    const [strategy, setStrategy] = useStrategy();
    const [dayDelay, setDayDelay] = useDayDelay();

    const settingsMenu = useRef<HTMLDivElement>(null);

    useOutsideAlerter(settingsMenu, () => setActive(false));

    return (
    <div className="Settings" ref={settingsMenu} >
        <MdSettings className="SettingsIcon" onClick={() => setActive(prev => !prev)}/> 
        <div className={classNames("SettingsMenu", {Active})} >
            <div className="Content">
                <h1>Settings</h1>
                <SubMenu title="Trader" containerRef={settingsMenu}>
                    {[
                        <InputTile title="Day delay" type="number" key="MaxTrades" measure="ms" defaultValue={dayDelay} onStateChange={(state) => {
                            console.log(state);
                            setDayDelay(parseInt(state));
                        }}/>,
                    ]}
                </SubMenu>
                <SubMenu title="Strategy" containerRef={settingsMenu}>
                    {
                        strategies.map(s => {
                            return (
                                <Checkbox className="Check" key={s} title={s.capitalize()} checked={[strategy == s, (state) => {if (state) setStrategy(s)}]}/>
                            )
                        })
                    }
                </SubMenu>
                <SubMenu title="Theme" containerRef={settingsMenu}>
                    {
                        Theme.values.map(v => {
                            return (
                                <Checkbox className="Check" key={v} title={Theme[v].capitalize()} checked={[theme == v, (state) => {if (state) setTheme(v)}]}/>
                            )
                        })
                    }
                </SubMenu>
            </div>
        </div>
    </div>
    )
}