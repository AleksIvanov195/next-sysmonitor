import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import type { ProcessDescription } from "pm2";

const execPromise = promisify(exec);

export async function GET() {
	try {
		const { stdout } = await execPromise("npm run prod:processes --silent");
		const processes : ProcessDescription[] = JSON.parse(stdout);

		const simplifiedStatus = processes.map((proc) => ({
			name: proc.name,
			status: proc.pm2_env?.status,
			cpu: proc.monit?.cpu ?? 0,
			memory: proc.monit?.memory ?? 0,
		}));

		return NextResponse.json(simplifiedStatus);
	} catch (error) {
		console.error("API: Failed to get pm2 process list.", error);
		return NextResponse.json({ message: "Failed to retrieve process list." }, { status: 500 });
	}
}