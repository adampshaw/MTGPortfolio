-- CreateTable
CREATE TABLE "CardEntry" (
    "id" TEXT NOT NULL,
    "cardName" TEXT NOT NULL,
    "pricePaid" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "currentPrice" DECIMAL(10,2),
    "lastChecked" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CardEntry_cardName_idx" ON "CardEntry"("cardName");
