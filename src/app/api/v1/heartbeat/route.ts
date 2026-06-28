import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const server = await prisma.server.findUnique({ where: { token } });

  if (!server) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const body = await request.json();
  const { players, maxPlayers, tps } = body as {
    players?: number;
    maxPlayers?: number;
    tps?: number;
  };

  await prisma.server.update({
    where: { id: server.id },
    data: {
      lastSeen: new Date(),
      online: true,
      ...(players !== undefined && { players }),
      ...(maxPlayers !== undefined && { maxPlayers }),
      ...(tps !== undefined && { tps }),
    },
  });

  return NextResponse.json({ ok: true });
}
