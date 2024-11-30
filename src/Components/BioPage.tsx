import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Styles/Bio.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const BioPage: React.FC = () => {
	const [step, setStep] = useState(1); // Tracks the current step
	const [error, setError] = useState(""); // Tracks error messages
	const [userData, setUserData] = useState({
		name: "",
		age: "",
		height: "",
		email: "",
		reason: [] as string[],
	});
	const [isReturningUser, setIsReturningUser] = useState(false); // Checks if user data exists
	const navigate = useNavigate();

	const reasons = [
		"Daily Practice",
		"To Grow Height",
		"To Lose Weight",
		"Increase Flexibility",
		"Mental Peace",
		"Boost Immunity",
		"Stress Relief",
	];

	// Check for existing user data in local storage
	useEffect(() => {
		const savedData = localStorage.getItem("userBioData");
		if (savedData) {
			const parsedData = JSON.parse(savedData);
			setUserData(parsedData);
			setIsReturningUser(true);
		}
	}, []);

	// Validate fields on step 1
	const validateStep1 = () => {
		if (!userData.name || !userData.age || !userData.email) {
			setError("Please fill all required fields.");
			return false;
		}
		setError("");
		return true;
	};

	const handleNext = () => {
		if (step === 1) {
			if (validateStep1()) {
				setStep(2);
			}
		} else if (step === 2) {
			localStorage.setItem("userBioData", JSON.stringify(userData));
			navigate("/cameraPage");
		}
	};

	const handleBack = () => {
		if (step > 1) setStep(step - 1);
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setUserData({ ...userData, [e.target.name]: e.target.value });
	};

	const handleReasonSelect = (reason: string) => {
		const updatedReasons = userData.reason.includes(reason)
			? userData.reason.filter((r) => r !== reason)
			: [...userData.reason, reason];
		setUserData({ ...userData, reason: updatedReasons });
	};

	const handleConfirmation = (confirm: boolean) => {
		if (confirm) {
			navigate("/cameraPage");
		} else {
			setUserData({
				name: "",
				age: "",
				height: "",
				email: "",
				reason: [],
			});
			setIsReturningUser(false);
		}
	};

	return (
		<motion.div
			className="bio-page-container"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="stepper-container">
				{/* If user is returning, show confirmation */}
				{isReturningUser ? (
					<motion.div
						className="confirmation-step"
						initial={{ scale: 0.9 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.5 }}
					>
						<h2>
							Welcome back, <span>{userData.name}</span>!
						</h2>
						<p>Is this you?</p>
						<div className="button-group">
							<button
								className="yes-button"
								onClick={() => handleConfirmation(true)}
							>
								Yes
							</button>
							<button
								className="no-button"
								onClick={() => handleConfirmation(false)}
							>
								No
							</button>
						</div>
					</motion.div>
				) : (
					<motion.div
						className="stepper"
						initial={{ scale: 0.9 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.5 }}
					>
						{/* Step 1: Collect user details */}
						{step === 1 && (
							<motion.div
								className="form-step"
								initial={{ x: "-100vw" }}
								animate={{ x: 0 }}
								exit={{ x: "100vw" }}
								transition={{ duration: 0.5 }}
							>
								<h2>Tell us about yourself</h2>
								<input
									type="text"
									name="name"
									placeholder="Your Name *"
									value={userData.name}
									onChange={handleInputChange}
								/>
								<input
									type="number"
									name="age"
									placeholder="Your Age *"
									value={userData.age}
									onChange={handleInputChange}
								/>
								<input
									type="number"
									name="height"
									placeholder="Your Height (cm) (Optional)"
									value={userData.height}
									onChange={handleInputChange}
								/>
								<input
									type="email"
									name="email"
									placeholder="Your Email *"
									value={userData.email}
									onChange={handleInputChange}
								/>
								{error && <p className="error-message">{error}</p>}
								<button className="next-button" onClick={handleNext}>
									Next
								</button>
								<div className="step1-animation">
									<DotLottieReact
										src="https://lottie.host/f9dbd54d-e697-45a6-bb05-0005ab57b1ef/Jd0PE52uI4.lottie"
										loop
										autoplay
									/>
								</div>
							</motion.div>
						)}

						{/* Step 2: Select reasons */}
						{step === 2 && (
							<motion.div
								className="form-step"
								initial={{ x: "100vw" }}
								animate={{ x: 0 }}
								exit={{ x: "-100vw" }}
								transition={{ duration: 0.5 }}
							>
								<h2>Why are you starting yoga?</h2>
								<div className="reason-container">
									{reasons.map((reason) => (
										<motion.div
											key={reason}
											className={`reason ${
												userData.reason.includes(reason) ? "selected" : ""
											}`}
											onClick={() => handleReasonSelect(reason)}
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
										>
											{reason}
										</motion.div>
									))}
								</div>
								<div className="button-group">
									<button className="back-button" onClick={handleBack}>
										Back
									</button>
									<button className="next-button" onClick={handleNext}>
										Finish
									</button>
								</div>
							</motion.div>
						)}
					</motion.div>
				)}
			</div>
		</motion.div>
	);
};

export default BioPage;
