-- CreateTable
CREATE TABLE "StoredPunishment" (
    "id" TEXT NOT NULL,
    "pluginId" TEXT NOT NULL,
    "playerUuid" TEXT NOT NULL,
    "playerName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "punisherName" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL,
    "removedBy" TEXT,
    "removedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoredPunishment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StoredPunishment_pluginId_idx" ON "StoredPunishment"("pluginId");

-- CreateIndex
CREATE INDEX "StoredPunishment_active_idx" ON "StoredPunishment"("active");

-- AddForeignKey
ALTER TABLE "StoredPunishment" ADD CONSTRAINT "StoredPunishment_pluginId_fkey" FOREIGN KEY ("pluginId") REFERENCES "Plugin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
