import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 0,
    path: "/",
  };

  response.cookies.set("server_tokens", "", opts);
  response.cookies.set("server_token", "", opts);
  return response;
}
