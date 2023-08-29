import { MdPlayArrow, MdStop, MdPause, MdCircle } from 'react-icons/md';
import './Buttons.scss';
import { useTraderRunningState } from '../../../Providers/TraderRunningStateProvider';
import { useTraderPausedState } from '../../../Providers/TraderPausedStateProvider';

export const RunButton = () => {
    
    const [running, setRunning] = useTraderRunningState();
    
    return (
        <button className="RunningButton" onClick={() => setRunning(!running)}>
            {running? 
                <><MdStop className="Stop"/>Stop</>: 
                <><MdPlayArrow className="Play"/>Start</>
            }
        </button>
    )
}

export const PauseButton = () => {
    
    const [paused, setPaused] = useTraderPausedState();
    const [running] = useTraderRunningState();

    return (
        <button className="RunningButton" onClick={ () => setPaused(!paused) } disabled={!running}>
            {paused? 
                <><MdCircle className="Resume"/>Resume</>: 
                <><MdPause className="Pause"/>Pause</>
            }
        </button>
    );
}