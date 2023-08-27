import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.scss";

import { registerLicense } from '@syncfusion/ej2-base';
import { TraderRunningStateProvider } from "./Providers/TraderRunningStateProvider";
import { TraderPausedStateProvider } from "./Providers/TraderPausedStateProvider";
import { TraderDailyUpdateProvider } from "./Providers/TraderDailyUpdateProvider";
import { MarketsUpdateProvider } from "./Providers/MarketsUpdateProvider";
import { DayDelayProvider } from "./Providers/DayDelayProvider";

registerLicense('ORg4AjUWIQA/Gnt2V1hiQlBEfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5bdEFiWH5XcXZXR2ZU');

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<TraderRunningStateProvider>
			<TraderPausedStateProvider>
				<TraderDailyUpdateProvider>
					<MarketsUpdateProvider>
						<DayDelayProvider>
							<App />
						</DayDelayProvider>
					</MarketsUpdateProvider>
				</TraderDailyUpdateProvider>
			</TraderPausedStateProvider>
		</TraderRunningStateProvider>
	</React.StrictMode>
);
