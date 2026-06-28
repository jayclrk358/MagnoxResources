import { NextResponse } from "next/server";
import { getServer } from "@/lib/auth";

export async function GET() {
  const server = await getServer();
  if (!server) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(server);
}
