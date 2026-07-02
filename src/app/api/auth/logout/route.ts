import { NextResponse } from "next/server";
import { cookieOptions } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  const opts = cookieOptions(0);
  response.cookies.set("server_tokens", "", opts);
  response.cookies.set("server_token", "", opts);
  return response;
}
