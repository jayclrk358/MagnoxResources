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
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // The dashboard page itself handles the "no servers connected yet" state
  // (shows an inline Add Server form), so new visitors aren't forced through
  // a separate token gate just to see the page. The server API still
  // requires a valid token — it just returns no data instead of a redirect.
  if (pathname.startsWith("/api/server") && !hasValidTokens(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
