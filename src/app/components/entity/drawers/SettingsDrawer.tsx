"use client";
import Drawer from "@/app/components/UI/Drawer";
import useLoad from "../../apiutils/useLoad";
import API from "../../apiutils/API";
import { useRef, useEffect } from "react";
import { AppSettings } from "@/lib/settings";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsDrawer = ({ isOpen, onClose }: SettingsDrawerProps) => {
	// State ---------------------------------------------
	const [settings, , loadingMessage, isLoading, reloadSettings] = useLoad<AppSettings>(
		"/api/settings",
		isOpen,
	);
	const intervalRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (settings?.monitoringInterval && intervalRef.current) {
			intervalRef.current.value = settings.monitoringInterval.toString();
		}
	}, [settings?.monitoringInterval, isOpen]);
	// Handlers ---------------------------------------------
	const handleToggleMonitoring = async (enabled: boolean) => {
		if (isLoading) return;
		await API.put("/api/edit-setting", { monitoringEnabled: enabled });
		reloadSettings();
	};
	const handleUpdateInterval = async () => {
		const raw = intervalRef.current?.value;
		const parsed = raw ? parseInt(raw, 10) : NaN;

		if (
			!isLoading &&
      settings?.monitoringEnabled &&
      !isNaN(parsed) &&
      parsed > 0 &&
      parsed !== settings.monitoringInterval
		) {
			await API.put("/api/edit-setting", { monitoringInterval: parsed });
			reloadSettings();
		}
	};
	// View ---------------------------------------------
	const monitoring = settings?.monitoringEnabled;
	const interval = settings?.monitoringInterval;
	return (
		<Drawer id="settings-drawer" isOpen={isOpen} onClose={onClose} title="Settings">
			<div className="flex flex-col gap-4">

				{/* Monitoring Status */}
				<div>
					<p className="mb-2 text-gray-600 dark:text-gray-300">Monitoring status:</p>
					{isLoading ? (
						<span className="text-blue-500">{loadingMessage}</span>
					) : monitoring ? (
						<span className="text-green-600 font-bold">Running</span>
					) : (
						<span className="text-red-500 font-bold">Stopped</span>
					)}
				</div>
				<div className="flex gap-2">
					<button
						className="px-4 py-2 rounded font-bold bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-75"
						onClick={() => handleToggleMonitoring(true)}
						disabled={monitoring || isLoading}
					>
  				Start Monitoring
					</button>
					<button
						className="px-4 py-2 rounded font-bold bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-75"
						onClick={() => handleToggleMonitoring(false)}
						disabled={!monitoring || isLoading}
					>
  				Stop Monitoring
					</button>
				</div>
				<div>
					<label className="block text-gray-600 dark:text-gray-300 mb-1">Monitoring Interval (ms):</label>
					<div className="flex gap-2">
						<input
							ref={intervalRef}
							type="number"
							className="px-3 py-2 rounded w-full text-sm border disabled:cursor-not-allowed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 "
							min={1}
							disabled={isLoading || !monitoring}
							placeholder="e.g. 30"
						/>
						<button
							onClick={handleUpdateInterval}
							disabled={isLoading || !monitoring}
							className="px-4 py-2 text-sm font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-75"
						>
              Update
						</button>
					</div>
					{interval && (
						<p className="mt-1 text-sm text-gray-500">
              Current: <span className="font-mono">{interval} ms</span>
						</p>
					)}
				</div>

				<hr className="border-t border-white" />
				<button
					onClick={onClose}
					className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 mt-2"
				>
          Close Menu
				</button>
			</div>
		</Drawer>
	);
};

export default SettingsDrawer;