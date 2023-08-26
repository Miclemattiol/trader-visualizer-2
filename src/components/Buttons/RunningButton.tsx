import { useTraderState, startTrader, stopTrader, pauseTrader } from "../../Providers/TraderStateProvider";
import { MdPlayArrow, MdStop, MdPause, MdCircle } from 'react-icons/md';
import './RunningButton.scss';

export const RunningButton = () => {
    
    const [traderState] = useTraderState();
    
    return (
        <button className="RunningButton" onClick={traderState.running? stopTrader: startTrader }>
            {traderState.running? 
                <><MdStop className="Stop"/>Stop</>: 
                <><MdPlayArrow className="Play"/>Start</>
            }
        </button>
    )
}

export const PauseButton = () => {
    
    const [traderState] = useTraderState();

    return (
        <button className="RunningButton" onClick={ pauseTrader } disabled={!traderState.running}>
            {traderState.paused? 
                <><MdCircle className="Resume"/>Resume</>: 
                <><MdPause className="Pause"/>Pause</>
            }
        </button>
    );
}