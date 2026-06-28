import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function POST(
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

  const newToken = randomBytes(32).toString("hex");
  const updated = await prisma.server.update({
    where: { id },
    data: { token: newToken },
  });

  return NextResponse.json({ token: updated.token });
}
