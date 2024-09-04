/*
  Warnings:

  - You are about to drop the column `capacity` on the `rooms` table. All the data in the column will be lost.
  - Added the required column `roomCapacity` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "capacity",
ADD COLUMN     "roomCapacity" INTEGER NOT NULL;
