/*
  Warnings:

  - A unique constraint covering the columns `[groupId]` on the table `GroupMembers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `GroupMembers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Expenses" DROP CONSTRAINT "Expenses_groupId_fkey";

-- DropIndex
DROP INDEX "GroupMembers_groupId_userId_key";

-- AlterTable
ALTER TABLE "Expenses" ALTER COLUMN "groupId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "role" SET DEFAULT 'user';

-- CreateIndex
CREATE UNIQUE INDEX "GroupMembers_groupId_key" ON "GroupMembers"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMembers_userId_key" ON "GroupMembers"("userId");

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
