-- CreateEnum
CREATE TYPE "PluginType" AS ENUM ('AURO_LOBBY', 'AURO_PUNISH');

-- CreateTable
CREATE TABLE "Server" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'My Server',
    "token" TEXT NOT NULL,
    "lastSeen" TIMESTAMP(3),
    "online" BOOLEAN NOT NULL DEFAULT false,
    "players" INTEGER NOT NULL DEFAULT 0,
    "maxPlayers" INTEGER NOT NULL DEFAULT 0,
    "tps" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plugin" (
    "id" TEXT NOT NULL,
    "type" "PluginType" NOT NULL,
    "version" TEXT,
    "serverId" TEXT NOT NULL,
    "lastSync" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plugin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfigFile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "pluginId" TEXT NOT NULL,
    "pending" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConfigFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Server_token_key" ON "Server"("token");
CREATE UNIQUE INDEX "Plugin_serverId_type_key" ON "Plugin"("serverId", "type");
CREATE UNIQUE INDEX "ConfigFile_pluginId_fileName_key" ON "ConfigFile"("pluginId", "fileName");

-- AddForeignKey
ALTER TABLE "Plugin" ADD CONSTRAINT "Plugin_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ConfigFile" ADD CONSTRAINT "ConfigFile_pluginId_fkey" FOREIGN KEY ("pluginId") REFERENCES "Plugin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
