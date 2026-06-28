import { NextResponse } from "next/server";
import { getServer, getServerToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const OFFLINE_THRESHOLD_MS = 2 * 60 * 1000;

export async function GET() {
  const server = await getServer();
  if (!server) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  return NextResponse.json(server);
}

export async function PUT(request: Request) {
  const token = await getServerToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name } = body as { name?: string };

  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const server = await prisma.server.update({
    where: { token },
    data: { name: name.trim() },
  });

  return NextResponse.json(server);
}
