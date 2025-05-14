import { NextResponse } from "next/server";
import { getHistoricData } from "@/lib/systemInfo";


export async function GET() {
	const systemInfo = await getHistoricData();
	return NextResponse.json(systemInfo);
}