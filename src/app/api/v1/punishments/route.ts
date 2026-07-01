import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PluginType } from "@prisma/client";

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
  const { pluginType, punishments } = body as {
    pluginType: string;
    punishments: {
      id: number;
      playerUuid: string;
      playerName: string;
      type: string;
      reason: string;
      punisherName: string;
      issuedAt: number;
      expiresAt: number | null;
      active: boolean;
      removedBy: string | null;
      removedAt: number | null;
    }[];
  };

  const type = pluginType as PluginType;
  if (!Object.values(PluginType).includes(type)) {
    return NextResponse.json({ error: "Invalid plugin type" }, { status: 400 });
  }

  const plugin = await prisma.plugin.findUnique({
    where: { serverId_type: { serverId: server.id, type } },
  });
  if (!plugin) {
    return NextResponse.json({ error: "Plugin not found" }, { status: 404 });
  }

  await prisma.storedPunishment.deleteMany({ where: { pluginId: plugin.id } });

  if (punishments && punishments.length > 0) {
    await prisma.storedPunishment.createMany({
      data: punishments.map((p) => ({
        id: `${plugin.id}_${p.id}`,
        pluginId: plugin.id,
        playerUuid: p.playerUuid,
        playerName: p.playerName,
        type: p.type,
        reason: p.reason,
        punisherName: p.punisherName,
        issuedAt: new Date(p.issuedAt),
        expiresAt: p.expiresAt != null ? new Date(p.expiresAt) : null,
        active: p.active,
        removedBy: p.removedBy ?? null,
        removedAt: p.removedAt != null ? new Date(p.removedAt) : null,
      })),
    });
  }

  return NextResponse.json({ ok: true, count: punishments?.length ?? 0 });
}
