import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BsCameraVideo, BsCameraVideoOff } from "react-icons/bs";
import { useSpeechSynthesis } from "react-speech-kit";
import "./Styles/CameraPose.css";
import { TOP_POSES } from "../Data/TopPoses";
import Pose from "../assets/Pose.png";

const CameraPage: React.FC = () => {
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const [cameraError, setCameraError] = useState<string | null>(null);
	const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
	const [selectedPose, setSelectedPose] = useState<string | null>(null);
	const [description, setDescription] = useState<string | null>(null);
	const [showSubtitles, setShowSubtitles] = useState<string | null>(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const { speak } = useSpeechSynthesis();
	const [selectedTimer, setSelectedTimer] = useState<number | null>(null);
	const [timeLeft, setTimeLeft] = useState<number | null>(null);
	const [isTimerDropdownOpen, setIsTimerDropdownOpen] =
		useState<boolean>(false);

	const TIMER_OPTIONS = [
		10,
		15,
		30,
		60,
		180,
		300,
		600, // In seconds
	];

	// Start/Stop camera
	useEffect(() => {
		const startCamera = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: true,
				});
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					videoRef.current.play();
				}
			} catch (error) {
				setCameraError(
					"Unable to access the camera. Please check permissions."
				);
				console.error("Camera Error:", error);
			}
		};

		if (isCameraOn) {
			startCamera();
		} else {
			if (videoRef.current && videoRef.current.srcObject) {
				(videoRef.current.srcObject as MediaStream)
					.getTracks()
					.forEach((track) => track.stop());
				videoRef.current.srcObject = null;
			}
		}

		return () => {
			if (videoRef.current && videoRef.current.srcObject) {
				(videoRef.current.srcObject as MediaStream)
					.getTracks()
					.forEach((track) => track.stop());
			}
		};
	}, [isCameraOn]);

	// Handle Timer Countdown
	useEffect(() => {
		if (timeLeft !== null && timeLeft >= 0) {
			const timer = setTimeout(() => {
				if (timeLeft === 3 || timeLeft === 2 || timeLeft === 1) {
					speak({ text: timeLeft.toString() });
				}
				if (timeLeft === 0) {
					speak({ text: "Time's up!" });
				}
				setTimeLeft(timeLeft - 1);
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [timeLeft, speak]);

	const handleToggleCamera = () => {
		setIsCameraOn((prev) => !prev);
	};

	const handleDropdownToggle = () => {
		setIsDropdownOpen((prev) => !prev);
	};

	const handleTimerDropdownToggle = () => {
		setIsTimerDropdownOpen((prev) => !prev);
	};

	const handleTimerSelect = (time: number) => {
		setSelectedTimer(time);
		setIsTimerDropdownOpen(false);
	};

	const handleStart = () => {
		if (!selectedPose || !selectedTimer || !isCameraOn) {
			alert("Please select a pose, a timer, and turn on the camera.");
			return;
		}

		setTimeLeft(selectedTimer);
		speak({
			text: description || "",
			rate: 1,
		});
	};

	const handlePoseSelect = (pose: string, desc: string) => {
		setSelectedPose(pose);
		setDescription(desc);
		setIsDropdownOpen(false);
		setShowSubtitles(desc); // Set subtitles to the description
	};

	return (
		<div className="camera-page-main-container">
			{cameraError ? (
				<p className="error-text">{cameraError}</p>
			) : (
				<>
					{/* Display the Selected Pose */}
					{selectedPose && (
						<motion.h1
							className="pose-heading"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5 }}
						>
							{selectedPose}
						</motion.h1>
					)}

					{/* Dropdown */}
					<div className="dropdown-container">
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							className="dropdown-button"
							onClick={handleDropdownToggle}
						>
							{isDropdownOpen ? "Select Pose Below" : "Select a Yoga Pose"}
						</motion.button>
						{isDropdownOpen && (
							<motion.div
								className="dropdown-menu"
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								transition={{ duration: 0.5 }}
							>
								{TOP_POSES.map((pose, index) => (
									<motion.div
										key={index}
										className="dropdown-item"
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										onClick={() =>
											handlePoseSelect(pose.title, pose.description)
										}
									>
										{pose.title}
									</motion.div>
								))}
							</motion.div>
						)}
					</div>

					{/* Timer Dropdown */}
					<div className="timer-selector-container">
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							className="dropdown-button"
							onClick={handleTimerDropdownToggle}
						>
							{isTimerDropdownOpen
								? "Select Timer Below"
								: `Timer: ${
										selectedTimer ? selectedTimer + " seconds" : "Select Timer"
								  }`}
						</motion.button>
						{isTimerDropdownOpen && (
							<motion.div
								className="dropdown-menu"
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								transition={{ duration: 0.5 }}
							>
								{TIMER_OPTIONS.map((time, index) => (
									<motion.div
										key={index}
										className="dropdown-item"
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										onClick={() => handleTimerSelect(time)}
									>
										{time}
									</motion.div>
								))}
							</motion.div>
						)}
					</div>

					{/* Video Camera */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 1, ease: "easeOut" }}
						className="video-wrapper"
					>
						{isCameraOn && (
							<video ref={videoRef} className="video-feed" autoPlay muted />
						)}
						<div className="pose-timer">
							{timeLeft !== null ? `${timeLeft}` : "00"}
						</div>
					</motion.div>

					{/* Start Button */}
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						className="start-button"
						onClick={handleStart}
					>
						Start
					</motion.button>

					{/* Toggle Button */}
					<motion.button
						whileHover={{ scale: 1.2 }}
						whileTap={{ scale: 0.9 }}
						transition={{ type: "spring", stiffness: 400, damping: 10 }}
						className="camera-toggle-button"
						onClick={handleToggleCamera}
					>
						{isCameraOn ? (
							<BsCameraVideoOff strokeWidth={1} />
						) : (
							<BsCameraVideo strokeWidth={1} />
						)}
					</motion.button>

					{showSubtitles && (
						<motion.p
							className="subtitles"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 1 }}
						>
							{showSubtitles}
						</motion.p>
					)}
				</>
			)}
			<div className="pose-pictures-container">
				<div className="pose-picture">
					<img src={Pose} alt="pose-img" />
				</div>
				<div className="pose-picture">
					<img src={Pose} alt="pose-img" />
				</div>
			</div>
		</div>
	);
};

export default CameraPage;
