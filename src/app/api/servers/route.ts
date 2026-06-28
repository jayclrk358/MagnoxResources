import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const servers = await prisma.server.findMany({
    where: { ownerId: session.userId },
    include: {
      plugins: {
        select: { id: true, type: true, version: true, lastSync: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(servers);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, address } = body as { name: string; address?: string };

  if (!name) {
    return NextResponse.json({ error: "Server name is required" }, { status: 400 });
  }

  const server = await prisma.server.create({
    data: {
      name,
      address,
      ownerId: session.userId,
    },
  });

  return NextResponse.json(server, { status: 201 });
}
