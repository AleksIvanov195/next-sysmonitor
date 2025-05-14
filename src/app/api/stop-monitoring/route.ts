import { NextResponse } from "next/server";
import { stopMonitoring } from "@/lib/monitorController";

export async function POST() {
	try {
		const result = await stopMonitoring();
		return NextResponse.json(result, {
			status: result.success ? 200 : 500,
		});
	} catch (error) {
		console.error("Unexpected error stopping monitoring:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Unexpected server error while stopping monitoring",
			},
			{ status: 500 },
		);
	}
}
