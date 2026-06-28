import { NextResponse } from "next/server";
import { getServerToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pluginId: string }> }
) {
  const token = await getServerToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { pluginId } = await params;

  const plugin = await prisma.plugin.findFirst({
    where: {
      id: pluginId,
      server: { token },
    },
    include: { configs: true },
  });

  if (!plugin) {
    return NextResponse.json({ error: "Plugin not found" }, { status: 404 });
  }

  return NextResponse.json(plugin.configs);
}
