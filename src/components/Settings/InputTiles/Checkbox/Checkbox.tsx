import { MdCheck } from "react-icons/md";
import './Checkbox.scss';
import { useState } from "react";
import classNames from "classnames";

type Props = {
    title: string,
    onStateChange?: (state: boolean) => void,
    checked?: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
    className?: string
}

export const Checkbox = ({ title, onStateChange, checked: [Checked, setChecked] = useState(false), className }: Props) => {


    return (
        <div className={classNames("Checkbox", className)} onClick={() => { setChecked(!Checked); onStateChange?.(Checked) }}>
            <MdCheck className={classNames("Icon", { Checked })} />
            {title}
        </div>
    )
}
