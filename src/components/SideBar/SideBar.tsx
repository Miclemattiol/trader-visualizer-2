import { OpenMenuButton } from '../Buttons/OpenMenuButton';
import { MdOutlineCompareArrows, MdStore } from 'react-icons/md'
import './SideBar.scss';
import classNames from 'classnames';
import { SideBarLink } from './SideBarLink/SideBarLink';

type Props = {
    Active: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export const SideBar = ({Active}: Props) => {

    return (
        <nav className={classNames("SideBar", { Active: Active[0] })}>
            <OpenMenuButton Active={Active}/>
            <div className="Content">
                <SideBarLink name='Trader' href="/trader" icon={<MdOutlineCompareArrows />}/>
                <SideBarLink name='Markets' href="/market" icon={<MdStore />}/>
            </div>
        </nav>
    )
}