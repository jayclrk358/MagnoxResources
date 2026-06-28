import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge,
    path: "/",
  };
}

async function getExistingTokens(): Promise<string[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("server_tokens")?.value;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  const legacy = cookieStore.get("server_token")?.value;
  if (legacy) return [legacy];
  return [];
}

export async function POST(request: Request) {
  const body = await request.json();
  const { token } = body as { token: string };

  if (!token || token.length < 16) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  let server = await prisma.server.findUnique({ where: { token } });

  if (!server) {
    server = await prisma.server.create({
      data: { token, name: "My Server" },
    });
  }

  const tokens = await getExistingTokens();
  if (!tokens.includes(token)) {
    tokens.push(token);
  }

  const response = NextResponse.json({ ok: true, serverName: server.name });
  response.cookies.set("server_tokens", JSON.stringify(tokens), cookieOptions(60 * 60 * 24 * 30));
  response.cookies.set("server_token", "", cookieOptions(0));
  return response;
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { serverId } = body as { serverId: string };

  if (!serverId) {
    return NextResponse.json({ error: "Server ID required" }, { status: 400 });
  }

  const server = await prisma.server.findUnique({ where: { id: serverId } });
  if (!server) {
    return NextResponse.json({ error: "Server not found" }, { status: 404 });
  }

  let tokens = await getExistingTokens();
  tokens = tokens.filter((t) => t !== server.token);

  const response = NextResponse.json({ ok: true });

  if (tokens.length === 0) {
    response.cookies.set("server_tokens", "", cookieOptions(0));
  } else {
    response.cookies.set("server_tokens", JSON.stringify(tokens), cookieOptions(60 * 60 * 24 * 30));
  }

  return response;
}
