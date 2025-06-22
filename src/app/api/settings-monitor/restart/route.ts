import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
const execPromise = promisify(exec);


export async function POST() {
	try {
		const { stderr } = await execPromise("npm run prod:restart:watcher --silent");
		if (stderr) {
			return NextResponse.json({ success: false, message: stderr }, { status: 500 });
		}
		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json({ success: false, message: error }, { status: 500 });
	}
}