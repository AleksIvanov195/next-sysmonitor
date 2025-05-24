import fs from "fs";
import { readSettings } from "./src/lib/settings.ts";
import { applySettings } from "./src/lib/applySettings.ts";

let lastSettings = await readSettings();
await applySettings(lastSettings);
console.log("File watcher started");

fs.watch("./data/settings.json", async (eventType) => {
	if (eventType === "change") {
		const settings = await readSettings();
		if (JSON.stringify(settings) !== JSON.stringify(lastSettings)) {
			await applySettings(settings);
			lastSettings = settings;
			console.log("Settings updated");
		}
	}
});