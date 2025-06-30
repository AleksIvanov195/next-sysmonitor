"use client";
import { useRef, useEffect } from "react";
import Switcher from "../../../UI/Switch";
import { useSettings } from "../../../SettingsProvider";
import { DrawerViewProps } from "../DrawerEntities.types";
import formatDuration from "@/app/components/utils/formatDuration";

const SettingsView = ({ isOpen }: DrawerViewProps) => {
	// Initialisation ---------------------------------------------
	const { settings, settingsMessage, isLoading, reloadSettings, updateSetting } = useSettings();
	// State ---------------------------------------------
	const liveFetchingIntervalRef = useRef<HTMLInputElement>(null);
	const monitoringIntervalRef = useRef<HTMLInputElement>(null);
	const cpuRef = useRef<HTMLInputElement>(null);
	const networkRef = useRef<HTMLInputElement>(null);
	const memoryRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (settings) {
			if (liveFetchingIntervalRef.current) liveFetchingIntervalRef.current.value = settings.liveFetchingInterval?.toString() || "";
			if (monitoringIntervalRef.current) monitoringIntervalRef.current.value = settings.monitoringInterval?.toString() || "";
			if (cpuRef.current) cpuRef.current.value = settings.cpuHistoryPoints?.toString() || "";
			if (networkRef.current) networkRef.current.value = settings.networkHistoryPoints?.toString() || "";
			if (memoryRef.current) memoryRef.current.value = settings.memoryHistoryPoints?.toString() || "";
		}
	}, [settings, isOpen]);
	useEffect(() => {
		reloadSettings();
	}, [isOpen]);

	// Handlers ---------------------------------------------
	const handleToggleMonitoring = async (enabled: boolean) => {
		if (isLoading) return;
		await updateSetting({ monitoringEnabled: enabled });
	};
	const handleUpdateInterval = async () => {
		if (isLoading || !settings?.monitoringEnabled) return;

		const rawValue = monitoringIntervalRef.current?.value;
		const newValue = rawValue ? parseInt(rawValue, 10) : NaN;

		if (isNaN(newValue) || newValue <= 0 || newValue === settings.monitoringInterval) return;

		await updateSetting({ monitoringInterval: newValue });
	};
	const handleUpdateLiveInterval = async () => {
		if (isLoading || !settings?.monitoringEnabled) return;

		const rawValue = liveFetchingIntervalRef.current?.value;
		const newValue = rawValue ? parseInt(rawValue, 10) : NaN;

		if (isNaN(newValue) || newValue <= 0 || newValue === settings.liveFetchingInterval) return;

		await updateSetting({ liveFetchingInterval: newValue });
	};
	const handleUpdateHistoryPoints = async (type: string, ref: React.RefObject<HTMLInputElement | null>, currentValue: number | undefined) => {
		if (isLoading) return;
		const rawValue = ref.current?.value;
		const newValue = rawValue ? parseInt(rawValue, 10) : NaN;
		if (isNaN(newValue) || newValue < 1 || newValue === currentValue) return;
		await updateSetting({ [`${type}HistoryPoints`]: newValue });
	};
	const handleUpdateShowHistoryOnLoad = async (checked: boolean) => {
		if (isLoading) return;
		updateSetting({ autoShowHistory: checked });
	};
	// View ---------------------------------------------
	const monitoring = settings?.monitoringEnabled;
	const monitoringInterval = settings?.monitoringInterval;
	return (
		<div className="flex flex-col gap-4">
			<div>
				<span className="mb-2 text-gray-600 dark:text-gray-300">Monitoring status: </span>
				{isLoading ? (
					<span className="text-blue-500">{settingsMessage}</span>
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
				<div>
					<label className="block text-gray-600 dark:text-gray-300 mb-1">
    UI Refresh Interval (ms):
					</label>
					<div className="flex gap-2">
						<input
							ref={liveFetchingIntervalRef}
							type="number"
							className="px-3 py-2 rounded w-full text-sm border disabled:cursor-not-allowed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 "
							min={1}
							disabled={isLoading}
							placeholder="e.g. 3000"
						/>
						<button
							onClick={handleUpdateLiveInterval}
							disabled={isLoading}
							className="px-4 py-2 text-sm font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-75"
						>
      Update
						</button>
					</div>
					{settings?.liveFetchingInterval && (
						<p className="mt-1 text-sm text-gray-500">
      Current: <span className="font-mono">{settings.liveFetchingInterval} ms</span>
						</p>
					)}
				</div>
				<label className="block text-gray-600 dark:text-gray-300 mb-1">Monitoring Interval (ms):</label>
				<div className="flex gap-2">
					<input
						ref={monitoringIntervalRef}
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
				{monitoringInterval && (
					<p className="mt-1 text-sm text-gray-500">
              Current: <span className="font-mono">{monitoringInterval} ms</span>
					</p>
				)}
			</div>
			<div>
				<label className="block text-gray-600 dark:text-gray-300 mb-1">CPU History Points:</label>
				<div className="flex gap-2">
					<input
						ref={cpuRef}
						type="number"
						className="px-3 py-2 rounded w-full text-sm border disabled:cursor-not-allowed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 "
						min={1}
						disabled={isLoading}
						placeholder="e.g. 1440"
					/>
					<button
						onClick={() => handleUpdateHistoryPoints("cpu", cpuRef, settings?.cpuHistoryPoints)}
						disabled={isLoading}
						className="px-4 py-2 text-sm font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-75"
					>
            Update
					</button>
				</div>
				{settings?.cpuHistoryPoints && monitoringInterval && (
					<p className="mt-1 text-sm text-gray-500">
    					Records: <span className="font-mono">{formatDuration(settings.cpuHistoryPoints * monitoringInterval)}</span>
					</p>
				)}
			</div>
			<div>
				<label className="block text-gray-600 dark:text-gray-300 mb-1">Network History Points:</label>
				<div className="flex gap-2">
					<input
						ref={networkRef}
						type="number"
						className="px-3 py-2 rounded w-full text-sm border disabled:cursor-not-allowed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 "
						min={1}
						disabled={isLoading}
						placeholder="e.g. 1440"
					/>
					<button
						onClick={() => handleUpdateHistoryPoints("network", networkRef, settings?.networkHistoryPoints)}
						disabled={isLoading}
						className="px-4 py-2 text-sm font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-75"
					>
            Update
					</button>
				</div>
				{settings?.networkHistoryPoints && monitoringInterval && (
					<p className="mt-1 text-sm text-gray-500">
    					Records: <span className="font-mono">{formatDuration(settings.networkHistoryPoints * monitoringInterval)}</span>
					</p>
				)}
			</div>
			<div>
				<label className="block text-gray-600 dark:text-gray-300 mb-1">Memory History Points:</label>
				<div className="flex gap-2">
					<input
						ref={memoryRef}
						type="number"
						className="px-3 py-2 rounded w-full text-sm border disabled:cursor-not-allowed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 "
						min={1}
						disabled={isLoading}
						placeholder="e.g. 1440"
					/>
					<button
						onClick={() => handleUpdateHistoryPoints("memory", memoryRef, settings?.memoryHistoryPoints)}
						disabled={isLoading}
						className="px-4 py-2 text-sm font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-75"
					>
            Update
					</button>
				</div>
				{settings?.memoryHistoryPoints && monitoringInterval && (
					<p className="mt-1 text-sm text-gray-500">
    					Records: <span className="font-mono">{formatDuration(settings.memoryHistoryPoints * monitoringInterval)}</span>
					</p>
				)}
			</div>
			<Switcher
				checked={!!settings?.autoShowHistory}
				onChange={checked => handleUpdateShowHistoryOnLoad(checked)}
				disabled={isLoading}
				label="Enable Auto Fetch of History"
			/>
			<hr className="border-t border-white" />
		</div>
	);
};

export default SettingsView;