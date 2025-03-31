import { NextResponse } from "next/server";
import { getRefreshedSystemInfo } from "@/lib/systemInfo";


export async function GET() {
	const systemInfo = await getRefreshedSystemInfo();
	return NextResponse.json(systemInfo);
}