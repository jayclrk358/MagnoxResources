import { NextResponse } from "next/server";
import { getServerTokens } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pluginId: string }> }
) {
  const tokens = await getServerTokens();
  if (tokens.length === 0) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { pluginId } = await params;

  const plugin = await prisma.plugin.findFirst({
    where: {
      id: pluginId,
      server: { token: { in: tokens } },
    },
  });

  if (!plugin) {
    return NextResponse.json({ error: "Plugin not found" }, { status: 404 });
  }

  const punishments = await prisma.storedPunishment.findMany({
    where: { pluginId },
    orderBy: { issuedAt: "desc" },
    take: 500,
  });

  return NextResponse.json(punishments);
}
