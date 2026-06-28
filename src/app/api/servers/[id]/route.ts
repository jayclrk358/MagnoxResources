import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const server = await prisma.server.findFirst({
    where: { id, ownerId: session.userId },
    include: {
      plugins: {
        include: {
          configs: {
            select: { id: true, name: true, fileName: true, pending: true, updatedAt: true },
          },
        },
      },
    },
  });

  if (!server) {
    return NextResponse.json({ error: "Server not found" }, { status: 404 });
  }

  return NextResponse.json(server);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { name, address } = body as { name?: string; address?: string };

  const server = await prisma.server.findFirst({
    where: { id, ownerId: session.userId },
  });

  if (!server) {
    return NextResponse.json({ error: "Server not found" }, { status: 404 });
  }

  const updated = await prisma.server.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(address !== undefined && { address }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const server = await prisma.server.findFirst({
    where: { id, ownerId: session.userId },
  });

  if (!server) {
    return NextResponse.json({ error: "Server not found" }, { status: 404 });
  }

  await prisma.server.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
