import fs from "fs";
import { readSettings } from "./src/lib/settings.ts";
import { applySettings } from "./src/lib/applySettings.ts";

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
			}
		}, 100);
	}
});