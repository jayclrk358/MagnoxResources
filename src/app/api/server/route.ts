import { NextResponse } from "next/server";
import { getServers, getServerTokens } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const OFFLINE_THRESHOLD_MS = 2 * 60 * 1000;

export async function GET() {
  const servers = await getServers();
  if (servers.length === 0) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  for (const server of servers) {
    if (
      server.online &&
      (!server.lastSeen ||
        Date.now() - new Date(server.lastSeen).getTime() > OFFLINE_THRESHOLD_MS)
    ) {
      await prisma.server.update({
        where: { id: server.id },
        data: { online: false },
      });
      server.online = false;
    }
  }

  return NextResponse.json(servers);
}

export async function PUT(request: Request) {
  const tokens = await getServerTokens();
  if (tokens.length === 0) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, serverId } = body as { name?: string; serverId?: string };

  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (!serverId) {
    return NextResponse.json({ error: "Server ID is required" }, { status: 400 });
  }

  const server = await prisma.server.findFirst({
    where: { id: serverId, token: { in: tokens } },
  });

  if (!server) {
    return NextResponse.json({ error: "Server not found" }, { status: 404 });
  }

  const updated = await prisma.server.update({
    where: { id: serverId },
    data: { name: name.trim() },
  });

  return NextResponse.json(updated);
}
