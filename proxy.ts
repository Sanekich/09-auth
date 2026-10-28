import { parseSetCookie } from "cookie";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from "@/lib/api/serverApi";

function copyRefreshedCookies(
  response: NextResponse,
  setCookieHeader: string | string[] | undefined,
): void {
  if (!setCookieHeader) return;

  const cookieHeaders = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];

  for (const cookieHeader of cookieHeaders) {
    const parsed = parseSetCookie(cookieHeader);

    if (!parsed.value) continue;

    response.cookies.set({
      name: parsed.name,
      value: parsed.value,
      ...(parsed.domain ? { domain: parsed.domain } : {}),
      ...(parsed.expires ? { expires: parsed.expires } : {}),
      ...(parsed.httpOnly !== undefined ? { httpOnly: parsed.httpOnly } : {}),
      ...(parsed.maxAge !== undefined ? { maxAge: parsed.maxAge } : {}),
      ...(parsed.path ? { path: parsed.path } : {}),
      ...(parsed.sameSite ? { sameSite: parsed.sameSite } : {}),
      ...(parsed.secure !== undefined ? { secure: parsed.secure } : {}),
    });
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPrivateRoute = pathname.startsWith("/notes") || pathname.startsWith("/profile");
  const isAuthRoute = pathname === "/sign-in" || pathname === "/sign-up";
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  let refreshedSetCookie: string | string[] | undefined;
  let hasSession = Boolean(accessToken);

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();
      hasSession = sessionResponse.data.success;
      refreshedSetCookie = sessionResponse.headers["set-cookie"];
    } catch {
      hasSession = false;
    }
  }

  if (isPrivateRoute && !hasSession) {
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    copyRefreshedCookies(response, refreshedSetCookie);
    return response;
  }

  if (isAuthRoute && hasSession) {
    const response = NextResponse.redirect(new URL("/profile", request.url));
    copyRefreshedCookies(response, refreshedSetCookie);
    return response;
  }

  const response = NextResponse.next();
  copyRefreshedCookies(response, refreshedSetCookie);
  return response;
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
