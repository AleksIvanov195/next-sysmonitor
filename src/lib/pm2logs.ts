import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

const allowedProcesses: { [key: string]: string } = {
	"settings-watcher": "watcher",
	"sys-monitor-app": "app",
};

export async function getProcessLogs(processName: string, logType: "out" | "error"): Promise<string> {
	const pm2Name = allowedProcesses[processName];

	if (!pm2Name) {
		throw new Error(`Process "${processName}" not found in process map.`);
	}

	const logFlag = logType === "error" ? "err" : "out";
	const command = `npm run prod:logs:${pm2Name}:${logFlag} --silent`;

	try {
		const { stdout, stderr } = await execPromise(command);
		if (stderr) {
			console.error(`Stderr from command "${command}": ${stderr}`);
			throw new Error(`An error occurred while fetching logs: ${stderr}`);
		}
		return stdout || `No ${logType} logs found for ${pm2Name}.`;
	} catch (error) {
		console.error(`Failed to execute pm2 logs for ${pm2Name}:${logFlag}:`, error);
		return `Error fetching logs for ${pm2Name}.`;
	}
};