import { cookies } from "next/headers";
import { prisma } from "./prisma";

export async function getServer() {
  const cookieStore = await cookies();
  const token = cookieStore.get("server_token")?.value;
  if (!token) return null;

  return prisma.server.findUnique({
    where: { token },
    include: {
      plugins: {
        include: {
          configs: {
            select: {
              id: true,
              name: true,
              fileName: true,
              pending: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  });
}

export async function getServerToken() {
  const cookieStore = await cookies();
  return cookieStore.get("server_token")?.value ?? null;
}
