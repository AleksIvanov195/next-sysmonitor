export interface AppSettings {
  monitoringEnabled: boolean;
	monitoringInterval: number;
}

const defaultSettings: AppSettings = { monitoringEnabled: false, monitoringInterval: 20000 };

export async function readSettings(): Promise<AppSettings> {
	const fs = await import("fs");
	const path = await import("path");
	const SETTINGS_PATH = path.resolve(process.cwd(), "data", "settings.json");

	if (!fs.existsSync(SETTINGS_PATH)) {
		// Ensure the directory exists
		fs.mkdirSync(path.dirname(SETTINGS_PATH), { recursive: true });
		fs.writeFileSync(SETTINGS_PATH, JSON.stringify(defaultSettings, null, 2));
		return defaultSettings;
	}
	const raw = fs.readFileSync(SETTINGS_PATH, "utf-8");
	return JSON.parse(raw) as AppSettings;
}

export async function writeSettings(settings: AppSettings): Promise<void> {
	const fs = await import("fs");
	const path = await import("path");
	const SETTINGS_PATH = path.resolve(process.cwd(), "data", "settings.json");

	// Ensure the directory exists
	fs.mkdirSync(path.dirname(SETTINGS_PATH), { recursive: true });
	fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
}