import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
