import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPrivateRoute = pathname.startsWith("/notes") || pathname.startsWith("/profile");
  const isAuthRoute = pathname === "/sign-in" || pathname === "/sign-up";
  const hasSession = Boolean(
    request.cookies.get("accessToken")?.value || request.cookies.get("refreshToken")?.value,
  );

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
