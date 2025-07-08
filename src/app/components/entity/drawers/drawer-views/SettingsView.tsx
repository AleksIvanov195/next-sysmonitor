"use client";
import { useEffect, useCallback } from "react";
import Switcher from "../../../UI/Switch";
import { useSettings } from "../../../SettingsProvider";
import { DrawerViewProps } from "../DrawerEntities.types";
import SettingsInputField from "../../form/SettingsInputField";
import { AppSettings } from "@/lib/settings/settingsManager";
import formatDuration from "@/app/components/utils/formatDuration";
import Separator from "@/app/components/UI/Separator";
import LearnMore from "@/app/components/UI/LearnMore";

const SettingsView = ({ isOpen }: DrawerViewProps) => {
	// Initialisation ---------------------------------------------
	const { settings, settingsMessage, isLoading, isBusy, reloadSettings, updateSetting } = useSettings();
	// State ---------------------------------------------
	useEffect(() => {
		if(isOpen) {
			reloadSettings();
		}
	}, [isOpen, reloadSettings]);

	// Handlers ---------------------------------------------
	const handleSettingUpdate = useCallback(async (settingUpdate: Partial<AppSettings>) => {
		if (isBusy) return;
		await updateSetting(settingUpdate);
	}, [isBusy, updateSetting]);
	const calculateDurationForHistoryPoints = useCallback((pointsValue: string): string => {
		const points = parseInt(pointsValue, 10) || 0;
		const interval = settings?.monitoringInterval || 0;
		const duration = formatDuration(points * interval);
		return `Records for: ${duration}`;
	}, [settings?.monitoringInterval]);
	// View ---------------------------------------------
	const monitoring = settings?.monitoringEnabled;
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-2">
				<h3 className="text-xl font-semibold text-black dark:text-white">Monitoring Settings</h3>
				<LearnMore href="https://github.com/AleksIvanov195/next-sysmonitor/blob/master/README.md#monitoring-settings" />
			</div>
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
					onClick={() => handleSettingUpdate({ monitoringEnabled: true })}
					disabled={monitoring || isLoading}
				>
  				Start Monitoring
				</button>
				<button
					className="px-4 py-2 rounded font-bold bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-75"
					onClick={() => handleSettingUpdate({ monitoringEnabled: false })}
					disabled={!monitoring || isLoading}
				>
  				Stop Monitoring
				</button>
			</div>
			<Separator />
			<div>
				<SettingsInputField
					label="Live Refresh Interval (ms)"
					settingName="liveFetchingInterval"
					type="number"
					currentValue={settings?.liveFetchingInterval}
					isLoading={isBusy}
					onUpdate={handleSettingUpdate}
					warningThreshold = {750}
				/>
				<SettingsInputField
					label="Monitoring Interval (ms)"
					settingName="monitoringInterval"
					type="number"
					currentValue={settings?.monitoringInterval}
					isLoading={isBusy || !monitoring}
					onUpdate={handleSettingUpdate}
					warningThreshold = {500}
				/>
				<SettingsInputField
					label="CPU History Points"
					settingName="cpuHistoryPoints"
					type="number"
					currentValue={settings?.cpuHistoryPoints}
					isLoading={isBusy}
					onUpdate={handleSettingUpdate}
					calculateHelpText={calculateDurationForHistoryPoints}
				/>
				<SettingsInputField
					label="Network History Points"
					settingName="networkHistoryPoints"
					type="number"
					currentValue={settings?.networkHistoryPoints}
					isLoading={isBusy}
					onUpdate={handleSettingUpdate}
					calculateHelpText={calculateDurationForHistoryPoints}
				/>
				<SettingsInputField
					label="Memory History Points"
					settingName="memoryHistoryPoints"
					type="number"
					currentValue={settings?.memoryHistoryPoints}
					isLoading={isBusy}
					onUpdate={handleSettingUpdate}
					calculateHelpText={calculateDurationForHistoryPoints}
				/>
			</div>
			<Switcher
				checked={!!settings?.autoShowHistory}
				onChange={checked => handleSettingUpdate({ autoShowHistory: checked })}
				disabled={isLoading}
				label="Enable Auto Fetch of History"
			/>
			<Separator />
		</div>
	);
};

export default SettingsView;