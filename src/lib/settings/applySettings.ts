import { AppSettings } from "./settingsManager";
import { setMaxCpuHistoryPoints } from "../cpuInfo";
import { setMaxNetworkHistoryPoints } from "../networkInfo";
import { setMaxMemoryHistoryPoints } from "../memoryInfo";
import { isMonitoring, restartMonitoring, stopMonitoring, startMonitoring } from "../monitorController";

let currentSettings: AppSettings | null = null;

export async function applySettings(settings: AppSettings): Promise<void> {
	try {
		if (!currentSettings || currentSettings.cpuHistoryPoints !== settings.cpuHistoryPoints) {
			console.log(`Updating cpuHistoryPoints to: ${settings.cpuHistoryPoints}`);
			setMaxCpuHistoryPoints(settings.cpuHistoryPoints);
		}

		if (!currentSettings || currentSettings.networkHistoryPoints !== settings.networkHistoryPoints) {
			console.log(`Updating networkHistoryPoints to: ${settings.networkHistoryPoints}`);
			setMaxNetworkHistoryPoints(settings.networkHistoryPoints);
		}

		if (!currentSettings || currentSettings.memoryHistoryPoints !== settings.memoryHistoryPoints) {
			console.log(`Updating memoryHistoryPoints to: ${settings.memoryHistoryPoints}`);
			setMaxMemoryHistoryPoints(settings.memoryHistoryPoints);
		}

		// Manage monitoring state
		const monitoringStatus = await isMonitoring();

		if (settings.monitoringEnabled) {
			if (!monitoringStatus) {
				// Was off, should be on
				console.log("State change: Monitoring was off, now starting...");
				await startMonitoring(settings.monitoringInterval);
			} else if (currentSettings && currentSettings.monitoringInterval !== settings.monitoringInterval) {
				// Was on, interval changed
				console.log(`Interval change: Restarting monitoring with new interval: ${settings.monitoringInterval}ms`);
				await restartMonitoring(settings.monitoringInterval);
			}
			// else already on and interval unchanged, do nothing
		} else {
			if (monitoringStatus) {
			// Was on, should be off
				console.log("State change: Monitoring was on, now stopping...");
				await stopMonitoring();
			}
			// else: already off, do nothing
		}

		// Finally cache the settings
		currentSettings = settings;
	} catch (error) {
		throw new Error(`Settings application failed: ${error instanceof Error ? error.message : "Unknown error"}`);
	}
}
