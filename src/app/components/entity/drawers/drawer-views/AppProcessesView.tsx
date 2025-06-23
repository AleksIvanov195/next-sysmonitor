"use client";
import { DrawerViewProps } from "../DrawerEntities.types";
import useLoad from "@/app/components/apiutils/useLoad";
import ProcessInfoCard from "../../cards/ProcessInfoCard";

export interface AppProcess {
    name: string;
    status: string;
    cpu: number;
    memory: number;
}

const AppProcessesView = ({ isOpen }: DrawerViewProps) => {
	// Initialisation ---------------------------------------------
	const [processes,,, isLoading, reloadProcesses] = useLoad<AppProcess[]>("/api/get-app-processes", isOpen);
	// State ---------------------------------------------
	// Handlers ---------------------------------------------
	// View ---------------------------------------------
	if (isLoading) {
		return <p className="text-center text-gray-400">Loading processes....</p>;
	}
	if(!processes) {
		return <p>No processes found.</p>;
	}
	return(
		<div>
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-xl font-semibold text-white">App Processes</h3>
				<button
					onClick={reloadProcesses}
					className="px-3 py-1 text-sm font-semibold rounded bg-white/10 text-white hover:bg-white/20">
				Refresh
				</button>
			</div>
			{processes.map((process) => (
				<ProcessInfoCard key = {process.name} process={process} reloadProcesses={reloadProcesses}/>
			))}
		</div>
	);
};


export default AppProcessesView;
