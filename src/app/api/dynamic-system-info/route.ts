import { NextResponse } from "next/server";
import { getDynamicSystemInfo } from "@/lib/systemInfo";


export async function GET() {
	const systemInfo = await getDynamicSystemInfo();
	return NextResponse.json(systemInfo);
}