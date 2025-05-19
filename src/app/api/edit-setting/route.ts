import { NextResponse } from "next/server";
import { readSettings, writeSettings, AppSettings } from "@/lib/settings";
import { startMonitoring, stopMonitoring, restartMonitoring } from "@/lib/monitorController";

export async function PUT(req: Request) {
	try {
		const updates = await req.json() as Partial<AppSettings>;
		const current = await readSettings();
		const newSettings = { ...current, ...updates };

		if (updates.monitoringEnabled !== undefined && updates.monitoringEnabled !== current.monitoringEnabled) {
			if (updates.monitoringEnabled) {
				await startMonitoring();
			} else {
				await stopMonitoring();
			}
		}

		if (updates.monitoringInterval !== undefined && updates.monitoringInterval !== current.monitoringInterval && current.monitoringEnabled) {
			await restartMonitoring(updates.monitoringInterval);
		}

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
