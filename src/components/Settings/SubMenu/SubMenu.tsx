import { MdKeyboardArrowDown } from "react-icons/md";
import './SubMenu.scss';
import { useState } from "react";
import classNames from "classnames";
import { useOutsideAlerter } from "../../../hooks/useOutsideAlterer";

type Props = {
    title: string,
    children?: JSX.Element[],
    containerRef: React.RefObject<HTMLDivElement>
}

export const SubMenu = ({ title, children, containerRef }: Props) => {

    const [Active, setActive] = useState(false);
    useOutsideAlerter(containerRef, () => setActive(false));

    return (
        <>
            <div className={classNames("SubMenuTile", {Active})} onClick={()=>setActive(prev => !prev)}>
                <span>{title}</span>
                <MdKeyboardArrowDown className="Icon"/>
            </div>
            <div className={classNames("SubMenu", {Active})} style={{height: `${(children?.length || 0)*30*(Active? 1:0)}px`}}>
                {children}
            </div>
        </>
    )
}