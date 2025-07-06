"use server";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { headers } from "next/headers";

export const logout = async () : Promise<void> => {
	const session = await getSession();
	session.destroy();
	const headersList = await headers();
	const ip = headersList.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
	const userAgent = headersList.get("user-agent") || "unknown";
	console.log(`[LOGOUT SUCCESS] IP: ${ip}, User-Agent: ${userAgent}`);
	redirect("/login");
};