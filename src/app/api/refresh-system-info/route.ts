import { NextResponse } from "next/server";
import { getFreshSystemInfo } from "@/lib/systemInfo";


export async function GET() {
	const systemInfo = await getFreshSystemInfo();
	return NextResponse.json(systemInfo);
}