import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loader from "./Components/LoaderPage";
import CameraPage from "./Components/CameraPage";
import BioPage from "./Components/BioPage";
import './App.css'

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Loader />} />
				<Route path="/cameraPage" element={<CameraPage />} />
				<Route path="/bio" element={<BioPage />} />
			</Routes>
		</Router>
	);
};

export default App;
