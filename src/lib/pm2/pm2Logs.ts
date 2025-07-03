import * as path from "path";
import * as os from "os";
import * as fs from "fs";

export async function getPm2Logs(): Promise<string> {
	const pm2Home = path.join(os.homedir(), ".pm2");
	const outFile = path.join(pm2Home, "pm2.log");
	try {
		if (fs.existsSync(outFile)) {
			return fs.readFileSync(outFile, "utf-8");
		}
		return `Log file not found at: ${outFile}`;
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return `Error reading log file at ${outFile}: ${message}`;
	}
};

