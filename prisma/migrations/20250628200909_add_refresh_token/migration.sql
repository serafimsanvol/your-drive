-- AlterTable
ALTER TABLE "users" ADD COLUMN     "refreshToken" TEXT;

-- CreateIndex
CREATE INDEX "users_id_idx" ON "users"("id");
