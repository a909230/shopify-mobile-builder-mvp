-- CreateTable
CREATE TABLE "StoreConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "qrCodeUrl" TEXT,
    "logoUrl" TEXT,
    "primaryColor" TEXT DEFAULT '#000000',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "StoreConfig_shop_key" ON "StoreConfig"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "StoreConfig_shortCode_key" ON "StoreConfig"("shortCode");
