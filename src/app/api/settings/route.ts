import { NextResponse } from "next/server";
import { readSettings } from "@/lib/settings/settingsManager";

export async function GET() {
	const settings = await readSettings();
	return NextResponse.json({
		...settings,
	});
}