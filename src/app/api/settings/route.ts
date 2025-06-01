import { NextResponse } from "next/server";
import { readSettings } from "@/lib/settings/settingsManager";
import { checkForSettingsError } from "@/lib/settings/settingsError";

export async function GET() {
	const settings = await readSettings();
	const watcherError = await checkForSettingsError();
	return NextResponse.json({
		...settings,
		watcherError: watcherError,
	});
}