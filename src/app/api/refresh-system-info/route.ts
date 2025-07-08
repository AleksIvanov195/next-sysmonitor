import { NextResponse } from "next/server";
import { refreshSystemInfo } from "@/lib/systemInfo";


export async function POST() {
	try {
		await refreshSystemInfo();
		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
	}
}