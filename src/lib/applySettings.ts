import { AppSettings } from "./settings";
import { setMaxCpuHistoryPoints } from "./CpuInfo";
import { setMaxNetworkHistoryPoints } from "./NetworkInfo";
import { isMonitoring, restartMonitoring, stopMonitoring, startMonitoring } from "./monitorController";

let currentSettings: AppSettings | null = null;

export async function applySettings(settings: AppSettings): Promise<void> {
	if (!currentSettings || currentSettings.cpuHistoryPoints !== settings.cpuHistoryPoints) {
		setMaxCpuHistoryPoints(settings.cpuHistoryPoints);
	}

	if (!currentSettings || currentSettings.networkHistoryPoints !== settings.networkHistoryPoints) {
		setMaxNetworkHistoryPoints(settings.networkHistoryPoints);
	}

	// Manage monitoring state
	const monitoringStatus = await isMonitoring();

	if (settings.monitoringEnabled) {
		if (!monitoringStatus.isMonitoring) {
			// Was off, should be on
			await startMonitoring(settings.monitoringInterval);
		} else if (currentSettings && currentSettings.monitoringInterval !== settings.monitoringInterval) {
			// Was on, interval changed
			await restartMonitoring(settings.monitoringInterval);
		}
		// else already on and interval unchanged, do nothing
	} else {
		if (monitoringStatus.isMonitoring) {
			// Was on, should be off
			await stopMonitoring();
		}
		// else: already off, do nothing
	}

	// Finally cache the settings for faster access next time.
	currentSettings = settings;
}
