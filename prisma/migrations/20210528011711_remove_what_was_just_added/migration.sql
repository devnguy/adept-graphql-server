/*
  Warnings:

  - You are about to drop the column `jobPostId` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Skill` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Skill` DROP FOREIGN KEY `Skill_ibfk_2`;

-- DropForeignKey
ALTER TABLE `Skill` DROP FOREIGN KEY `Skill_ibfk_1`;

-- AlterTable
ALTER TABLE `Skill` DROP COLUMN `jobPostId`,
    DROP COLUMN `userId`;
