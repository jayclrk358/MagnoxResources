import { cookies } from "next/headers";
import { prisma } from "./prisma";

// No Domain attribute means the cookie is host-only and won't be sent when
// navigating between subdomains (panel/docs/plugins/root all share one app).
// Scope it to the whole apex domain in production so login carries over.
export function cookieOptions(maxAge: number) {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    maxAge,
    path: "/",
    ...(isProd ? { domain: ".magnoxresources.com" } : {}),
  };
}

export async function getServerTokens(): Promise<string[]> {
  const cookieStore = await cookies();

  const tokensRaw = cookieStore.get("server_tokens")?.value;
  if (tokensRaw) {
    try {
      const parsed = JSON.parse(tokensRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {}
  }

  const singleToken = cookieStore.get("server_token")?.value;
  if (singleToken) return [singleToken];

  return [];
}

export async function getServers() {
  const tokens = await getServerTokens();
  if (tokens.length === 0) return [];

  return prisma.server.findMany({
    where: { token: { in: tokens } },
    include: {
      plugins: {
        include: {
          configs: {
            select: {
              id: true,
              name: true,
              fileName: true,
              pending: true,
              updatedAt: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getServer() {
  const servers = await getServers();
  return servers[0] ?? null;
}

export async function getServerToken() {
  const tokens = await getServerTokens();
  return tokens[0] ?? null;
}
