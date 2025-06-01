import fs from "fs";
import { readSettings, writeSettings } from "./src/lib/settings/settingsManager.ts";
import { applySettings } from "./src/lib/settings/applySettings.ts";
import path from "path";

const dataDir = path.resolve(process.cwd(), "data");
// Ensure settings-error.json exists
const errorFile = path.join(dataDir, "settings-error.json");
if (!fs.existsSync(errorFile)) {
	fs.writeFileSync(errorFile, JSON.stringify({ error: null }, null, 2));
}

// Ensure status file exists
const statusFile = path.join(dataDir, "settings-monitor-status.json");
if (!fs.existsSync(statusFile)) {
	fs.writeFileSync(statusFile, JSON.stringify({ running: true, lastUpdated: Date.now() }, null, 2));
}

const writeError = async (error) => {
	const errorMessage = error ? { error: String(error) } : { error: null };
	await fs.promises.writeFile("./data/settings-error.json", JSON.stringify(errorMessage));
};

let lastSettings = await readSettings();
await applySettings(lastSettings);
await writeError(null);
console.log("File watcher started");

let timeout;

fs.watch("./data/settings.json", async (eventType) => {
	if (eventType === "change") {
		clearTimeout(timeout);
		timeout = setTimeout(async () => {
			try {
				const settings = await readSettings();
				if (JSON.stringify(settings) !== JSON.stringify(lastSettings)) {
					await applySettings(settings);
					lastSettings = settings;
					await writeError(null);
					console.log("Settings updated");
				}
			} catch (error) {
				console.error("Error applying settings:", error);
				await writeError(error);
				console.log("Reverting to previous settings...");
				try {
					// Revert the file to last known good settings
					await writeSettings(lastSettings);
					// Re-apply the last good settings to ensure system state is correct
					await applySettings(lastSettings);
					console.log("Successfully reverted to previous settings");

				} catch (revertError) {
					console.error("Failed to revert settings:", revertError);
					console.error("System may need a restart. Please check the settings file manually.");
				}
			}finally{
				fs.writeFileSync(statusFile, JSON.stringify({ running: true, lastUpdated: Date.now() }, null, 2));
			}
		}, 100);
	}
});

process.on("exit", () => {
	fs.writeFileSync(statusFile, JSON.stringify({ running: false, lastUpdated: Date.now() }));
});