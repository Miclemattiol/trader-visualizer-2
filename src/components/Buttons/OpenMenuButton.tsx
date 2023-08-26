import { MdMenu, MdClose } from "react-icons/md";
import './OpenMenuButton.scss';
import { useState } from "react";
import classNames from "classnames";

type Props = Omit<JSX.IntrinsicElements["button"], "className">&{
    Active: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
};

export const OpenMenuButton = ({onClick, Active: [Active, setActive], ...props}: Props) => {

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        setActive(prev => !prev);
        onClick?.(event);
    }

    return (
        <button className={classNames("OpenMenuButton", {Active})} onClick={handleClick} {...props}>
            <MdMenu className="Open"/>
            <MdClose className="Close"/>
        </button>
    );
}