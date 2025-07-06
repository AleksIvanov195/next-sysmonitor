import { NextResponse, NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, IronSessionData } from "./lib/session";


export async function middleware(request: NextRequest) {
	const response = NextResponse.next();
	const session = await getIronSession<IronSessionData>(request, response, sessionOptions);
	const { isLoggedIn } = session;
	const { pathname } = request.nextUrl;
	const isPublicPage = pathname === "/login";
	const isApiRoute = pathname.startsWith("/api");

	if (!isLoggedIn) {
		if (isApiRoute) {
			return NextResponse.json({ message: "Authentication required." }, { status: 401 });
		}
		if (!isPublicPage) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}
	if (isLoggedIn && isPublicPage) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return response;
}
export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};