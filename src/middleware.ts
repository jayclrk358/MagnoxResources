import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function hasValidTokens(request: NextRequest): boolean {
  const tokensRaw = request.cookies.get("server_tokens")?.value;
  if (tokensRaw) {
    try {
      const parsed = JSON.parse(tokensRaw);
      if (Array.isArray(parsed) && parsed.length > 0) return true;
    } catch {}
  }

  if (request.cookies.get("server_token")?.value) return true;

  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/login" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/v1")
  ) {
    return NextResponse.next();
  }

  if (!hasValidTokens(request)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/server/:path*"],
};
