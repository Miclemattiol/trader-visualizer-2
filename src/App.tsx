import "./App.scss";
import { useTraderPausedState } from "./Providers/TraderPausedStateProvider";
import { useTraderRunningState } from "./Providers/TraderRunningStateProvider";
import { useTraderDailyUpdate } from "./Providers/TraderDailyUpdateProvider";
import { useMarketsUpdate } from "./Providers/MarketsUpdateProvider";

function App() {

	const [running, setRunning] = useTraderRunningState();
	const [paused, setPaused] = useTraderPausedState();
	const dailyUpdates = useTraderDailyUpdate();
	const marketUpdates = useMarketsUpdate();

	return (
		<main>
			<button onClick={running ? () => setRunning(false) : () => setRunning(true) }>{running ? "Stop" : "Start"}</button>
			<button onClick={() => setPaused(!paused)}>{paused ? "Resume" : "Pause"}</button>

			{dailyUpdates.map((dailyUpdate, index) => (
				<div key={index}>
					{dailyUpdate.currencies.eur}
				</div>
			))}
			<br /><br />
			{Object.keys(marketUpdates).map((marketUpdate, index) => (
				<div key={index}>
					{marketUpdate}
				</div>
			))}
		</main>
	);
}

export default App;
