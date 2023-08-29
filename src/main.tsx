import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.scss";

import { registerLicense } from '@syncfusion/ej2-base';
import { TraderRunningStateProvider } from "./Providers/TraderRunningStateProvider";
import { TraderPausedStateProvider } from "./Providers/TraderPausedStateProvider";
import { ThemeProvider } from "./Providers/ThemeProvider";
import { StrategyProvider } from "./Providers/StrategyProvider";

registerLicense('ORg4AjUWIQA/Gnt2V1hiQlBEfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5bdEFiWH5XcXZXR2ZU');

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<StrategyProvider>
			<TraderRunningStateProvider>
				<TraderPausedStateProvider>
					<ThemeProvider>
						<App />
					</ThemeProvider>
				</TraderPausedStateProvider>
			</TraderRunningStateProvider>
		</StrategyProvider>
	</React.StrictMode>
);
