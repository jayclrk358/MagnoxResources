import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { token } = body as { token: string };

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const server = await prisma.server.findUnique({ where: { token } });

  if (!server) {
    return NextResponse.json(
      { error: "Invalid token. Make sure your plugin has synced at least once." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true, serverName: server.name });
  response.cookies.set("server_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}
