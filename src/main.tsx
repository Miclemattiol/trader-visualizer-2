import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.scss";

import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('ORg4AjUWIQA/Gnt2V1hiQlBEfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5bdEFiWH5XcXZXR2ZU');

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
