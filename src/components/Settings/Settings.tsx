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
import { useWatchedCurrencies } from "../../Providers/WatchedCurrenciesProvider";
import { Currency } from "../../assets/types";

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

    const [watchedCurrencies, setWatchedCurrency] = useWatchedCurrencies();

    return (
    <div className="Settings" ref={settingsMenu} >
        <MdSettings className="SettingsIcon" onClick={() => setActive(prev => !prev)}/> 
        <div className={classNames("SettingsMenu", {Active})} >
            <div className="Content">
                <h1>Settings</h1>
                <SubMenu title="Trader" containerRef={settingsMenu}>
                    {[
                        <InputTile title="Day delay" type="number" key="MaxTrades" measure="ms" defaultValue={dayDelay} onStateChange={(state) => {
                            setDayDelay(parseInt(state));
                        }}/>,
                        <Checkbox key="EUR" className="Check" title="EUR" checked={[watchedCurrencies.EUR, (state) => { setWatchedCurrency(Currency.EUR, state.valueOf() as boolean)} ]} />,
                        <Checkbox key="USD" className="Check" title="USD" checked={[watchedCurrencies.USD, (state) => { setWatchedCurrency(Currency.USD, state.valueOf() as boolean)} ]} />,
                        <Checkbox key="YEN" className="Check" title="YEN" checked={[watchedCurrencies.YEN, (state) => { setWatchedCurrency(Currency.YEN, state.valueOf() as boolean)} ]} />,
                        <Checkbox key="YUAN" className="Check" title="YUAN" checked={[watchedCurrencies.YUAN, (state) => { setWatchedCurrency(Currency.YUAN, state.valueOf() as boolean)} ]} />
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