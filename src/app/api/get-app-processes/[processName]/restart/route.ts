import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
const execPromise = promisify(exec);

export async function POST(request: NextRequest, { params }: { params: Promise<{ processName: string }> }) {
	const { processName } = await params;
	const allowedProcesses : Record<string, string> = {
		"settings-watcher": "watcher",
		"sys-monitor-app": "app",
	};
	if(allowedProcesses[processName]) {
		try {
			const { stderr } = await execPromise(`npm run prod:restart:${allowedProcesses[processName]} --silent`);
			if (stderr) {
				return NextResponse.json({ success: false, message: stderr }, { status: 500 });
			}
			return NextResponse.json({ success: true });
		} catch (error) {
			return NextResponse.json({ success: false, message: error }, { status: 500 });
		}
	}

}