export interface WatcherError {
  error: string | null;
}

export interface AppSettings {
  monitoringEnabled: boolean;
	autoShowHistory: boolean,
	monitoringInterval: number;
	cpuHistoryPoints: number;
  networkHistoryPoints: number;
  memoryHistoryPoints: number;
}

const defaultSettings: AppSettings = {
	monitoringEnabled: false,
	autoShowHistory: true,
	monitoringInterval: 60000,
	cpuHistoryPoints: 1440,
	networkHistoryPoints: 1440,
	memoryHistoryPoints: 1440,
};

export const readSettings = async (): Promise<AppSettings> => {
	const fs = await import("fs");
	const path = await import("path");
	const settingsPath = path.resolve(process.cwd(), "data", "settings.json");

	if (!fs.existsSync(settingsPath)) {
		// Ensure the directory exists
		fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
		fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2));
		return defaultSettings;
	}
	const raw = fs.readFileSync(settingsPath, "utf-8");
	return JSON.parse(raw) as AppSettings;
};

export const writeSettings = async (settings: AppSettings): Promise<void> => {
	const fs = await import("fs");
	const path = await import("path");
	const settingsPath = path.resolve(process.cwd(), "data", "settings.json");

	// Ensure the directory exists
	fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
	fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
};