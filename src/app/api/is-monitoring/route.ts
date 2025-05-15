import { NextResponse } from "next/server";
import { isMonitoring } from "@/lib/monitorController";

export async function GET() {
	try {
		const result = await isMonitoring();

		if (result.success) {
			return NextResponse.json(result, { status: 200 });
		}
	} catch (error) {
		console.error("Error checking monitoring status:", error);
		return NextResponse.json(
			{
				success: false,
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}