import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PluginType } from "@prisma/client";

function getServerFromAuth(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

export async function POST(request: Request) {
  const token = getServerFromAuth(request);
  if (!token) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const body = await request.json();
  const { pluginType, configs } = body as {
    pluginType: string;
    configs: { fileName: string; name: string; content: unknown }[];
  };

  const type = pluginType as PluginType;
  if (!Object.values(PluginType).includes(type)) {
    return NextResponse.json({ error: "Invalid plugin type" }, { status: 400 });
  }

  let server = await prisma.server.findUnique({ where: { token } });

  if (!server) {
    server = await prisma.server.create({
      data: { token, name: "My Server" },
    });
  }

  const plugin = await prisma.plugin.upsert({
    where: { serverId_type: { serverId: server.id, type } },
    create: {
      type,
      serverId: server.id,
      version: body.version,
    },
    update: {
      version: body.version,
      lastSync: new Date(),
    },
  });

  for (const config of configs) {
    await prisma.configFile.upsert({
      where: { pluginId_fileName: { pluginId: plugin.id, fileName: config.fileName } },
      create: {
        name: config.name,
        fileName: config.fileName,
        content: config.content as object,
        pluginId: plugin.id,
      },
      update: {
        content: config.content as object,
        name: config.name,
      },
    });
  }

  return NextResponse.json({ ok: true, pluginId: plugin.id });
}

export async function GET(request: Request) {
  const token = getServerFromAuth(request);
  if (!token) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const url = new URL(request.url);
  const pluginType = url.searchParams.get("pluginType") as PluginType;

  if (!pluginType || !Object.values(PluginType).includes(pluginType)) {
    return NextResponse.json({ error: "Invalid plugin type" }, { status: 400 });
  }

  const server = await prisma.server.findUnique({ where: { token } });
  if (!server) {
    return NextResponse.json({ changes: [] });
  }

  const plugin = await prisma.plugin.findUnique({
    where: { serverId_type: { serverId: server.id, type: pluginType } },
    include: {
      configs: { where: { pending: true } },
    },
  });

  if (!plugin) {
    return NextResponse.json({ changes: [] });
  }

  const changes = plugin.configs.map((c) => ({
    fileName: c.fileName,
    name: c.name,
    content: c.content,
  }));

  if (changes.length > 0) {
    await prisma.configFile.updateMany({
      where: { pluginId: plugin.id, pending: true },
      data: { pending: false },
    });
    await prisma.plugin.update({
      where: { id: plugin.id },
      data: { lastSync: new Date() },
    });
  }

  return NextResponse.json({ changes });
}
