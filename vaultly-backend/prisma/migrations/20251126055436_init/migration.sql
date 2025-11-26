/*
  Warnings:

  - You are about to drop the column `group_id` on the `Expenses` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Expenses` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `Users` table. All the data in the column will be lost.
  - Added the required column `groupId` to the `Expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Expenses" DROP CONSTRAINT "Expenses_group_id_fkey";

-- DropForeignKey
ALTER TABLE "Expenses" DROP CONSTRAINT "Expenses_user_id_fkey";

-- AlterTable
ALTER TABLE "Expenses" DROP COLUMN "group_id",
DROP COLUMN "user_id",
ADD COLUMN     "groupId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "password_hash",
ADD COLUMN     "passwordHash" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
