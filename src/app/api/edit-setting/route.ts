import { NextResponse } from "next/server";
import { readSettings, writeSettings, AppSettings } from "@/lib/settings/settingsManager";

export async function PUT(req: Request) {
	try {
		const updates = await req.json() as Partial<AppSettings>;
		const current = await readSettings();
		const newSettings = { ...current, ...updates };
		await writeSettings(newSettings);

		return NextResponse.json(
			{ success: true, settings: newSettings },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error editing settings:", error);
		return NextResponse.json(
			{ success: false, message: "Unexpected server error while editing settings" },
			{ status: 500 },
		);
	}
}
