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

function getSubdomain(host: string): string | null {
  const hostname = host.split(":")[0];
  if (hostname === "localhost" || hostname === "127.0.0.1") return null;
  const parts = hostname.split(".");
  if (parts.length >= 3) return parts[0];
  return null;
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;
  const subdomain = getSubdomain(host);

  if (
    pathname === "/login" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/v1")
  ) {
    return NextResponse.next();
  }

  // Subdomain routing
  if (subdomain === "docs" && pathname === "/") {
    return NextResponse.rewrite(new URL("/docs", request.url));
  }

  if (subdomain === "plugins" && pathname === "/") {
    return NextResponse.rewrite(new URL("/plugins", request.url));
  }

  if (subdomain === "panel" && pathname === "/") {
    const dest = hasValidTokens(request) ? "/dashboard" : "/login";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // Auth check for dashboard and server API
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/server")) {
    if (!hasValidTokens(request)) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
