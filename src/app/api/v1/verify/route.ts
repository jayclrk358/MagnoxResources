import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const server = await prisma.server.findUnique({
    where: { token },
    include: { plugins: true },
  });

  if (!server) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  return NextResponse.json({
    serverId: server.id,
    serverName: server.name,
    plugins: server.plugins.map((p) => ({
      id: p.id,
      type: p.type,
      version: p.version,
    })),
  });
}
