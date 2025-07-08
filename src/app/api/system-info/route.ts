import { NextResponse } from "next/server";
import { getSystemInfo } from "@/lib/systemInfo";


export async function GET() {
	try {
		const systemInfo = await getSystemInfo();
		return NextResponse.json(systemInfo);
	}catch(error) {
		return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
	}

}