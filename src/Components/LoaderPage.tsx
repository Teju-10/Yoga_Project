import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./Styles/Loader.css";

const Loader: React.FC = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const animationDuration = 5500; // Animation duration in milliseconds
		const timeout = setTimeout(() => {
			navigate("/bio");
		}, animationDuration);

		return () => clearTimeout(timeout); // Cleanup on unmount
	}, [navigate]);

	return (
		<div className="loader-container">
			<DotLottieReact
				src="https://lottie.host/ac1dc8a4-ee6d-4b87-8352-1940c711ce04/seNiiMG50Q.lottie"
				loop={false}
				autoplay
				style={{ width: "400px", height: "400px" }}
			/>
		</div>
	);
};

export default Loader;
