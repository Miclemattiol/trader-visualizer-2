import { PauseButton, RunningButton } from "../Buttons/RunningButton";
import { MdSettings } from "react-icons/md";
import './Header.scss';
import { SettingsButton } from "../Settings/Settings";

type Props = {
    title: string;
}

export const Header = ({ title }: Props) => {
    return (
        <header className="Header">
            <h1>{title}</h1>
            <div className="ButtonsContainer">
                <RunningButton />
                <PauseButton />
                <SettingsButton />
            </div>
        </header>
    );
}