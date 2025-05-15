"use client";
import Drawer from "@/app/components/UI/Drawer";
import useLoad from "../../apiutils/useLoad";
import API from "../../apiutils/API";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsDrawer = ({ isOpen, onClose }: SettingsDrawerProps) => {
	// State ---------------------------------------------
	  const [status, , loadingMessage, isLoading, reloadStatus] = useLoad<{ isMonitoring: boolean }>(
		"/api/is-monitoring",
		isOpen,
	);
	// Handlers ---------------------------------------------
	const handleStartMonitoring = async () => {
		if (isLoading) return;
		await API.post("/api/start-monitoring");
		reloadStatus();
	};

	const handleStopMonitoring = async () => {
		if (isLoading) return;
		await API.post("/api/stop-monitoring");
		reloadStatus();
	};
	// View ---------------------------------------------
	  return (
		<Drawer
			id="settings-drawer"
			isOpen={isOpen}
			onClose={onClose}
			title="Settings"
		>
			<div className="flex flex-col gap-4">
				<div>
					<p className="mb-2 text-gray-600 dark:text-gray-300">Monitoring status:</p>
					{isLoading ? (
						<span className="text-blue-500">{loadingMessage}</span>
					) : status?.isMonitoring ? (
						<span className="text-green-600 font-bold">Running</span>
					) : (
						<span className="text-red-500 font-bold">Stopped</span>
					)}
				</div>
				<div className="flex gap-2">
					<button
						className={`px-4 py-2 rounded font-bold ${
							status?.isMonitoring || isLoading
								? "bg-gray-400 cursor-not-allowed"
								: "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
						}`}
						onClick={handleStartMonitoring}
						disabled={status?.isMonitoring || isLoading}
					>
            Start Monitoring
					</button>
					<button
						className={`px-4 py-2 rounded font-bold ${
							!status?.isMonitoring || isLoading
								? "bg-gray-400 cursor-not-allowed"
								: "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
						}`}
						onClick={handleStopMonitoring}
						disabled={!status?.isMonitoring || isLoading}
					>
            Stop Monitoring
					</button>
				</div>
				<hr className="border-t border-white" />
				<button
					onClick={onClose}
					className="w-full px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 mt-2"
				>
          Close Menu
				</button>
			</div>
		</Drawer>
	);
};

export default SettingsDrawer;