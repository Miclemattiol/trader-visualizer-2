import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";
import { MarketsUpdateProvider } from "./Providers/MarketsUpdateProvider";
import { TraderDailyUpdateProvider } from "./Providers/TraderDailyUpdateProvider";
import { Header } from "./components/Header/Header";
import { MarketsPage } from "./pages/MarketsPage/MarketsPage";
import { TraderPage } from "./pages/TraderPage/TraderPage";

function App() {

	return (
		<main className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/trader/" element={
						<>
							<Header />
							<TraderDailyUpdateProvider>
								<TraderPage />
							</TraderDailyUpdateProvider>
						</>}
					/>
					<Route path="/market/" element={
						<>
							<Header />
							<MarketsUpdateProvider>
								<MarketsPage />
							</MarketsUpdateProvider>
						</>
					}
					/>

					<Route path="*" element={<Navigate to="/trader/" />} />
				</Routes>
			</BrowserRouter>
		</main>
	);
}

export default App;
