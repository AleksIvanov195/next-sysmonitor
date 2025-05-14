import { NextResponse } from "next/server";
import { startMonitoring } from "@/lib/monitorController";

export async function POST() {
	try {
		const result = await startMonitoring();
		return NextResponse.json(result, {
			status: result.success ? 200 : 500,
		});
	} catch (error) {
		console.error("Unexpected error starting monitoring:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Unexpected server error while starting monitoring",
			},
			{ status: 500 },
		);
	}
}
