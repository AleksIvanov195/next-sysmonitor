import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import allowedProcesses from "@/lib/pm2/allowedProcesses";
const execPromise = promisify(exec);

export async function POST(request: NextRequest, { params }: { params: Promise<{ processName: string }> }) {
	const { processName } = await params;
	try {
		if (allowedProcesses[processName]) {
			const { stderr } = await execPromise(`npm run prod:restart:${allowedProcesses[processName]} --silent`);
			if (stderr) {
				return NextResponse.json({ success: false, message: stderr }, { status: 500 });
			}
			return NextResponse.json({ success: true });
		}else{
			return NextResponse.json({ success: false, message: "Unauthorised" }, { status: 403 });
		}
	} catch (error) {
		return NextResponse.json({ success: false, message: error }, { status: 500 });
	}


}