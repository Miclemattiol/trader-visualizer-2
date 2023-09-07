import './InputTile.scss';
import { useRef } from "react";
import classNames from "classnames";

type Props = {
    title: string,
    onStateChange?: (state: string) => void,
    type: "number" | "text",
    className?: string,
    measure?: string,
    defaultValue?: string | number,
}

export const InputTile = ({ title, onStateChange, className, type, measure, defaultValue }: Props) => {

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className={classNames("InputTile", className)} onClick={() => { }}>
            {title}
            <div className="InputContainer">
                <input defaultValue={defaultValue} type="text" ref={inputRef} onInput={(e) => {
                    if(type == "text") return;
                    const s = (e.target as HTMLInputElement).value;
                    try{
                        const n = parseInt(s);
                        if(isNaN(n)) throw new Error("Not a number");
                        (e.target as HTMLInputElement).value = n.toString();
                    }catch{
                        (e.target as HTMLInputElement).value = s.substring(0, s.length - 1);
                    }
                }}
                onBlur={(e) => {
                    onStateChange?.((e.target as HTMLInputElement).value);
                }}
                onKeyDown={e => {
                    if(e.key == "Enter"){
                        onStateChange?.((e.target as HTMLInputElement).value);
                    }
                }}
                />
                {measure}
            </div>
        </div>
    )
}
