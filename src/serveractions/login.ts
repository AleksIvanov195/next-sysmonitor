"use server";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import bcrypt from "bcrypt";
import { headers } from "next/headers";

export interface LoginFormState {
    error: string | null;
}

export const login = async (prevState: LoginFormState, formData: FormData) : Promise<LoginFormState> => {
	const password = formData.get("password") as string;
	const session = await getSession();

	const storedHash = process.env.ADMIN_PASSWORD_HASH;
	if (!storedHash) {
		return { error: "Application not configured. Please set up a admin password." };
	}

	const isMatch = await bcrypt.compare(password, storedHash);
	const headersList = await headers();
	const ip = headersList.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
	const userAgent = headersList.get("user-agent") || "unknown";
	if (isMatch) {
		session.isLoggedIn = true;
		console.log(`[LOGIN SUCCESS] IP: ${ip}, User-Agent: ${userAgent}`);
		await session.save();
		redirect("/");
	} else {
		console.log(`[INVALID LOGIN] IP: ${ip}, User-Agent: ${userAgent}`);
		return { error: "Invalid password." };
	}
};