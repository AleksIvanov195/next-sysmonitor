import fs from "fs";

export const checkForSettingsError = async () => {
	try {
		const data = await fs.promises.readFile("./data/settings-error.json", "utf8");
		if (!data.trim()) return { error: null };
		const watcherError = JSON.parse(data);
		return watcherError;
	} catch {
		return { error: null };
	}
};