import { prisma } from "./prisma";

export async function authenticatePlugin(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  const server = await prisma.server.findUnique({
    where: { token },
    include: { plugins: true },
  });

  return server;
}
