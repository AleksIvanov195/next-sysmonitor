import fs from "fs";
import { readSettings, writeSettings } from "./src/lib/settings/settingsManager.ts";
import { applySettings } from "./src/lib/settings/applySettings.ts";

console.log("Settings watcher/monitor processes started");

let lastSettings = await readSettings();
await applySettings(lastSettings);

let timeout;

fs.watch("./data/settings.json", async (eventType) => {
	if (eventType === "change") {
		clearTimeout(timeout);
		timeout = setTimeout(async () => {
			console.log("Settings change detected, udpating...");
			try {
				const settings = await readSettings();
				if (JSON.stringify(settings) !== JSON.stringify(lastSettings)) {
					await applySettings(settings);
					lastSettings = settings;
					console.log("Settings updated and applied.");
				}
			} catch (error) {
				console.log("Error applying settings, please check error logs.");
				console.error("Error applying settings:", error);
				console.log("Reverting to previous settings...");
				try {
					// Revert the file to last known good settings
					await writeSettings(lastSettings);
					// Re-apply the last good settings to ensure system state is correct
					await applySettings(lastSettings);
					console.log("Successfully reverted to previous settings");

				} catch (revertError) {
					console.log("Error reverting settings, please check error logs.");
					console.error("Failed to revert settings:", revertError);
					console.error("System may need a restart.");
				}
			}
		}, 100);
	}
});
