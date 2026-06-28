import { NextResponse } from "next/server";
import { authenticatePlugin } from "@/lib/plugin-auth";

export async function POST(request: Request) {
  const server = await authenticatePlugin(request);
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
