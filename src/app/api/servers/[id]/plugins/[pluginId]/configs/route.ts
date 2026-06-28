import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; pluginId: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, pluginId } = await params;

  const plugin = await prisma.plugin.findFirst({
    where: {
      id: pluginId,
      server: { id, ownerId: session.userId },
    },
    include: { configs: true },
  });

  if (!plugin) {
    return NextResponse.json({ error: "Plugin not found" }, { status: 404 });
  }

  return NextResponse.json(plugin.configs);
}
