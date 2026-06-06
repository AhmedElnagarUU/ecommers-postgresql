-- AlterTable: add sku, isActive, images to ProductVariantCombination
ALTER TABLE "ProductVariantCombination"
  ADD COLUMN "sku"      TEXT,
  ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "images"   TEXT[]  NOT NULL DEFAULT ARRAY[]::TEXT[];

-- CreateIndex: unique SKU
CREATE UNIQUE INDEX "ProductVariantCombination_sku_key"
  ON "ProductVariantCombination"("sku");
