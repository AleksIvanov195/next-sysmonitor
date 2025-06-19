import { NextResponse } from "next/server";
import fs from "fs";


export async function GET() {
	const data = await fs.promises.readFile("./data/settings-monitor-status.json", "utf8");
	const parsedData = JSON.parse(data);
	const currentTimestamp = Date.now();
	const diffInMs = Math.abs(currentTimestamp - parsedData.lastUpdated);
	if(diffInMs > 2) {
		return NextResponse.json(parsedData);
	}
	return NextResponse.json(parsedData);
};