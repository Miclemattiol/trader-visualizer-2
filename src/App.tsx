import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";
import { ThemeProvider } from "./Providers/ThemeProvider";
import { TraderStateProvider } from "./Providers/TraderStateProvider";
import Trader from "./pages/Trader/Trader";
import Market from "./pages/Market/Market";
import { TraderDataProvider } from "./Providers/TraderDataProvider";

function App() {

	return (
		<ThemeProvider>
			<TraderStateProvider>
				<TraderDataProvider>
					<div className="container">
						<BrowserRouter>
							<Routes>
								<Route path="/trader/" Component={Trader } />
								<Route path="/market/" Component={Market } />

								<Route path="*" element={<Navigate to="/trader/" />} />
							</Routes>
						</BrowserRouter>
					</div>
				</TraderDataProvider>
			</TraderStateProvider>
		</ThemeProvider>
	);
}

export default App;
