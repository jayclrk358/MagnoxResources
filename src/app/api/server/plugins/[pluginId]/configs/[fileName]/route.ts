import { NextResponse } from "next/server";
import { getServerTokens } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pluginId: string; fileName: string }> }
) {
  const tokens = await getServerTokens();
  if (tokens.length === 0) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { pluginId, fileName } = await params;

  const config = await prisma.configFile.findFirst({
    where: {
      fileName: decodeURIComponent(fileName),
      plugin: {
        id: pluginId,
        server: { token: { in: tokens } },
      },
    },
  });

  if (!config) {
    return NextResponse.json({ error: "Config not found" }, { status: 404 });
  }

  return NextResponse.json(config);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ pluginId: string; fileName: string }> }
) {
  const tokens = await getServerTokens();
  if (tokens.length === 0) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { pluginId, fileName } = await params;
  const body = await request.json();
  const { content } = body as { content: unknown };

  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const config = await prisma.configFile.findFirst({
    where: {
      fileName: decodeURIComponent(fileName),
      plugin: {
        id: pluginId,
        server: { token: { in: tokens } },
      },
    },
  });

  if (!config) {
    return NextResponse.json({ error: "Config not found" }, { status: 404 });
  }

  const updated = await prisma.configFile.update({
    where: { id: config.id },
    data: {
      content: content as object,
      pending: true,
    },
  });

  return NextResponse.json(updated);
}
