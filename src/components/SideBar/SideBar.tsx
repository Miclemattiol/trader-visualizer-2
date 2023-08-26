import { useState } from 'react';
import { OpenMenuButton } from '../Buttons/OpenMenuButton';
import './SideBar.scss';
import classNames from 'classnames';

export const SideBar = () => {
    
    const [Active, setActive] = useState(true);

    return (
        <nav className={classNames("SideBar", {Active})}>
            <OpenMenuButton Active={[Active, setActive]}/>
            <div className="Content">
            </div>
        </nav>
    )
}