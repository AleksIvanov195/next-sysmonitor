"use client";
import { useState } from "react";
import API from "@/app/components/apiutils/API";
import { DrawerViewProps } from "../DrawerEntities.types";
import useLoad from "@/app/components/apiutils/useLoad";
import ProcessInfoCard from "../../cards/ProcessInfoCard";
import Link from "next/link";
import Separator from "@/app/components/UI/Separator";
import LearnMore from "@/app/components/UI/LearnMore";

export interface AppProcess {
    name: string;
    status: string;
    cpu: number;
    memory: number;
}

const AppProcessesView = ({ isOpen }: DrawerViewProps) => {
	// Initialisation ---------------------------------------------
	const [processes,,, isLoading, reloadProcesses] = useLoad<AppProcess[]>("/api/get-app-processes", isOpen);
	const [isActionLoading, setIsActionLoading] = useState(false);
	const [isRestarting, setIsRestarting] = useState(false);
	// State ---------------------------------------------
	// Handlers ---------------------------------------------
	const handleClearAllLogs = async () : Promise<void> => {
		setIsActionLoading(true);
		const result = await API.post("/api/logs/clear-all");
		if(!result.isSuccess) alert(`An error occured: ${result.message}`);
		setIsActionLoading(false);
	};
	const handleRestartAll = async (): Promise<void> => {
		const confirmed = window.confirm(
			"WARNING: This will restart the entire application.\n\n" +
  		"If the application fails to come back online, you will need to view the PM2 logs and diagnose the issue. The likely solution would be to manually restart the app\n\n" +
  		"Are you sure you want to proceed?",
		);
		if (!confirmed) {
			return;
		}
		setIsRestarting(true);
		const result = await API.post("/api/get-app-processes/restart-all");
		if(!result.isSuccess) {
			// NetworkError will always happen, because the web app itself is down while restarting.
			if(result.message !== "Error: NetworkError when attempting to fetch resource.") {
				alert(`An unexpected error occurred: ${result.message}`);
			}
		}
		reloadProcesses();
		setIsRestarting(false);
	};
	// View ---------------------------------------------
	const loading = () => {
		if(isLoading) {
			return <p className="text-center text-gray-400">Loading processes....</p>;
		};
	};
	const displayProcesses = () => {
		if(!processes) {
			return <p>No processes found.</p>;
		} else{
			return (
				<>
					{processes.map((process) => (
						<ProcessInfoCard key = {process.name} process={process} reloadProcesses={reloadProcesses} isRefreshing = {isRestarting}/>
					))}
				</>
			);
		}
	};
	return(
		<div>
			<div className="flex justify-between items-center mb-4">
				<div className="flex items-center gap-2">
					<h3 className="text-xl font-semibold text-black dark:text-white">App Processes</h3>
				  <LearnMore href="https://github.com/AleksIvanov195/next-sysmonitor/blob/master/README.md#app-processes" />
				</div>
				<button
					onClick={reloadProcesses}
					className="px-3 py-1 text-sm font-semibold rounded bg-white/10 text-white hover:bg-white/20">
				Refresh
				</button>
			</div>
			<div className="flex flex-wrap gap-2 mb-2">
				<button
					onClick={handleRestartAll}
					disabled={isRestarting}
					className="flex-1 px-3 py-2 text-xs font-semibold rounded bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-500"
				>
					Restart All Processes
				</button>
				<button
					onClick={handleClearAllLogs}
					disabled={isActionLoading}
					className="flex-1 px-3 py-2 text-xs font-semibold rounded bg-yellow-600 text-white hover:bg-yellow-700 disabled:bg-gray-500"
				>
					Clear All Logs
				</button>
				<Link
					href="/logs/pm2/out"
					target="_blank"
					rel="noopener noreferrer"
					className="flex-1 text-center px-3 py-2 text-xs font-semibold rounded bg-gray-600 text-white hover:bg-gray-700"
				>
          PM2 Daemon Logs
				</Link>
			</div>
			<Separator />
			<div className="mt-4">
				{isLoading ? (
					loading()
				) : (
					displayProcesses()
				)}
			</div>
		</div>
	);
};


export default AppProcessesView;
