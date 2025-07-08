import { getIronSession, IronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface IronSessionData {
	isLoggedIn: boolean;
}

export const sessionOptions: SessionOptions = {
	password: process.env.SESSION_SECRET as string,
	cookieName: "next-sysmonitor-session",
	cookieOptions: {
		secure: process.env.HTTPS_ENABLED === "true",
		httpOnly: true,
	},
};

export const getSession = async (): Promise<IronSession<IronSessionData>> => {
	const session = await getIronSession<IronSessionData>(await cookies(), sessionOptions);
	return session;
};