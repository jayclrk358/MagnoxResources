import { NextResponse } from "next/server";
import { getServer, getServerToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const server = await getServer();
  if (!server) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
