import { NextRequest } from "next/server";
import { getProcessLogs } from "@/lib/pm2/pm2ProcessLogs";

export async function GET(request: NextRequest, { params }: { params: Promise<{ processName: string; logType: string }> }) {
	const { processName, logType } = await params;
	if (logType !== "out" && logType !== "error") {
		return new Response("Invalid log type. Must be 'out' or 'error'.", {
			status: 400,
		});
	}
	try {
		const logs = await getProcessLogs(processName, logType);
		return new Response(logs, {
			headers: { "Content-Type": "text/plain; charset=utf-8" },
		});
	} catch (error) {
		return new Response(error instanceof Error ? error.message : "An unknown error occurred", { status: 404 });
	}
}