"use server";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import bcrypt from "bcrypt";

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

	if (isMatch) {
		session.isLoggedIn = true;
		await session.save();
		redirect("/");
	} else {
		return { error: "Invalid password." };
	}
};