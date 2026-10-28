import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from "@/lib/api/serverApi";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPrivateRoute = pathname.startsWith("/notes") || pathname.startsWith("/profile");
  const isAuthRoute = pathname === "/sign-in" || pathname === "/sign-up";
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let hasSession = Boolean(accessToken);

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();
      hasSession = sessionResponse.data.success;
    } catch {
      hasSession = false;
    }
  }

  if (isPrivateRoute && !hasSession) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL("/notes/filter/all", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
