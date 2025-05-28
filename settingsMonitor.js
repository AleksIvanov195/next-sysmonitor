import fs from "fs";
import { readSettings, writeSettings } from "./src/lib/settings/settingsManager.ts";
import { applySettings } from "./src/lib/settings/applySettings.ts";

let lastSettings = await readSettings();
await applySettings(lastSettings);
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
					console.log("Settings updated");
				}
			} catch (error) {
				console.error("Error applying settings:", error);
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
			}
		}, 100);
	}
});