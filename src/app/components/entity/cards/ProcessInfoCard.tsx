"use client";
import { useState } from "react";
import Link from "next/link";
import { AppProcess } from "../drawers/drawer-views/AppProcessesView";
import API from "../../apiutils/API";

interface ProcessInfoCard {
	process: AppProcess;
	reloadProcesses: () => void;
}

const ProcessInfoCard = ({ process, reloadProcesses }: ProcessInfoCard) => {
	// Initialisation ---------------------------------------------
	// State ---------------------------------------------
	const [isRestarting, setIsRestarting] = useState(false);
	// Handlers ---------------------------------------------
	const handleRestart = async () => {
		setIsRestarting(true);
		await API.post("/api/settings-monitor/restart");
		reloadProcesses();
	};
	// View ---------------------------------------------
	const getStatusBorderColor = () => {
		if (isRestarting) {
			return "border-l-orange-500 animate-pulse";
		}
		if (process.status === "online") {
			return "border-l-green-500";
		}
		return "border-l-red-500";
	};
	return(
		<div className={`bg-gray-700 rounded-lg border-l-[6px] ${getStatusBorderColor()} p-4 flex flex-col justify-between gap-3 mb-3 transition-all duration-300`}>
			<div>
				<p className="font-semibold text-white text-lg">{process.name}</p>
				<p className="text-sm text-gray-300 capitalize">
					{isRestarting ? "Restarting..." : `Status: ${process.status}`}
				</p>
			</div>
			<div className="flex items-center gap-6">
				<div className="flex items-baseline gap-1">
					<p className="font-bold text-white">{process.cpu}%</p>
					<p className="text-xs text-gray-400">CPU</p>
				</div>
				<div className="flex items-baseline gap-1">
					<p className="font-bold text-white">
						{(process.memory / (1024 * 1024)).toFixed(1)}
					</p>
					<p className="text-xs text-gray-400">MB</p>
				</div>
			</div>
			<div className="flex gap-2">
				<button
					onClick={handleRestart}
					disabled={isRestarting}
					className="px-4 p-1.5 text-xs font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-wait"
				>
					{isRestarting ? "..." : "Restart"}
				</button>
				<Link
					href={`/logs/${process.name}/out`}
					target="_blank"
					rel="noopener noreferrer"
					className="px-4 p-1.5 text-xs font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-wait"
				>
					Logs
				</Link>
				<Link
					href={`/logs/${process.name}/error`}
					target="_blank"
					rel="noopener noreferrer"
					className="px-4 p-1.5 text-xs font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-wait"
				>
					Error Logs
				</Link>
			</div>
		</div>
	);
};

export default ProcessInfoCard;