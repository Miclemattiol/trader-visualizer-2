import { MdSettings } from "react-icons/md";
import './Settings.scss';
import classNames from "classnames";
import { useRef, useState } from "react";
import { invoke } from "@tauri-apps/api"
import { Checkbox } from "./InputTiles/Checkbox/Checkbox";
import { useTheme, Theme } from "../../Providers/ThemeProvider";
import { SubMenu } from "./SubMenu/SubMenu";
import { useOutsideAlerter } from "../../hooks/useOutsideAlterer";
import { InputTile } from "./InputTiles/InputTile/InputTile";
import { constants } from "../../assets/types";

declare global {
    interface String {
        capitalize(): string;
    }
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

const dayDelay = await invoke<number>(constants.functions.GET_DAY_DELAY);

export const SettingsButton = () => {
    const [Active, setActive] = useState(false);
    const [theme, setTheme] = useTheme();

    const settingsMenu = useRef<HTMLDivElement>(null);

    useOutsideAlerter(settingsMenu, () => setActive(false));

    return (
    <div className="Settings" ref={settingsMenu} >
        <MdSettings className="SettingsIcon" onClick={() => setActive(prev => !prev)}/> 
        <div className={classNames("SettingsMenu", {Active})} >
            <div className="Content">
                <h1>Settings</h1>
                <SubMenu title="Theme" containerRef={settingsMenu}>
                    {
                        Theme.values.map(v => {
                            return (
                                <Checkbox className="ThemeCheck" key={v} title={Theme[v].capitalize()} checked={[theme == v, (state) => {if (state) setTheme(v)}]}/>
                            )
                        })
                    }
                </SubMenu>
                <SubMenu title="Trader" containerRef={settingsMenu}>
                    {[
                        <InputTile initialValue={dayDelay} title="Day delay" type="number" key="MaxTrades" measure="ms" onStateChange={(state) => {
                            console.log(state);
                            invoke(constants.functions.SET_DAY_DELAY, {time: parseInt(state)});
                        }}/>,
                    ]}
                </SubMenu>
            </div>
        </div>
    </div>
    )
}