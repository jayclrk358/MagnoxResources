import { NextResponse } from "next/server";
import { authenticatePlugin } from "@/lib/plugin-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const server = await authenticatePlugin(request);
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
