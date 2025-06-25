"use client";
import { useState, useEffect } from "react";

const LiveClock = () => {
	const [currentTime, setCurrentTime] = useState<Date | null>(null);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(timer);
	}, []);
	if (!currentTime) {
		return (
			<div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-lg rounded-lg shadow-lg p-6 flex flex-col items-center justify-center gap-1 mb-6 min-h-[124px]">
				<p className="text-5xl font-bold text-white/90 tabular-nums tracking-wider">--:--</p>
				<p className="text-xl font-medium text-white/70">Loading...</p>
			</div>
		);
	}
	const hour = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	const date = currentTime.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" });

	return (
		<div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-lg rounded-lg shadow-lg p-6 flex flex-col items-center justify-center gap-1 mb-6">
			<p className="text-5xl font-bold text-white/90 tabular-nums tracking-wider">{hour}</p>
			<p className="text-xl font-medium text-white/70">
				<span className="capitalize">{date}</span>
			</p>
		</div>
	);
};

export default LiveClock;