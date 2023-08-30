import { Link } from 'react-router-dom';
import { DayDelayProvider } from '../../Providers/DayDelayProvider';
import { SettingsButton } from '../Settings/Settings';
import { PauseButton, RunButton } from './Buttons/Buttons';
import './Header.scss';
import { invoke } from '@tauri-apps/api';
import { constants } from '../../assets/types';

type Props = {

}

export const Header = ({ }: Props) => {

    const clickHandler = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if(!(event.ctrlKey || event.metaKey)) return;
        event.preventDefault();
        invoke(constants.functions.open_in_new_window, { href: event.currentTarget.href });
    }

    return (
        <header className="Header">
            <h1>Trader Visualizer</h1>

            <div className="links">
                <Link to="/trader/" onClick={clickHandler}>Trader</Link>
                <Link to="/market/" onClick={clickHandler}>Market</Link>
            </div>

            <div className="buttons">
                <RunButton />
                <PauseButton />
                <DayDelayProvider>
                    <SettingsButton />
                </DayDelayProvider>
            </div>
        </header>
    )
}