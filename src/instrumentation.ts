export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		const { readSettings } = await import("./lib/settings");
		const settings = await readSettings();
		console.log("Hi from Instrumentation");
		console.log("Loaded settings:", settings);
	}
}