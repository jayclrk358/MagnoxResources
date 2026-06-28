import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { login, password } = body as { login: string; password: string };

  if (!login || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: login }, { username: login }] },
  });

  if (!user || !(await compare(password, user.password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signToken({
    userId: user.id,
    email: user.email,
    username: user.username,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
