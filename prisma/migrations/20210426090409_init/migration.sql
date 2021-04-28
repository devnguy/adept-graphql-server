/*
  Warnings:

  - The primary key for the `JobApplication` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `jobPostingId` on the `JobApplication` table. All the data in the column will be lost.
  - The primary key for the `JobPosting` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `JobPosting` table. All the data in the column will be lost.
  - The primary key for the `Resume` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Resume` table. All the data in the column will be lost.
  - The primary key for the `School` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `School` table. All the data in the column will be lost.
  - The primary key for the `Skill` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Skill` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - The primary key for the `WorkExperience` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `WorkExperience` table. All the data in the column will be lost.
  - Added the required column `jobPostId` to the `JobApplication` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `JobApplication` DROP FOREIGN KEY `JobApplication_ibfk_2`;

-- DropForeignKey
ALTER TABLE `JobApplication` DROP FOREIGN KEY `JobApplication_ibfk_1`;

-- DropForeignKey
ALTER TABLE `JobPosting` DROP FOREIGN KEY `JobPosting_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Resume` DROP FOREIGN KEY `Resume_ibfk_1`;

-- DropForeignKey
ALTER TABLE `School` DROP FOREIGN KEY `School_ibfk_1`;

-- DropForeignKey
ALTER TABLE `WorkExperience` DROP FOREIGN KEY `WorkExperience_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_JobPostingToSkill` DROP FOREIGN KEY `_JobPostingToSkill_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_JobPostingToSkill` DROP FOREIGN KEY `_JobPostingToSkill_ibfk_2`;

-- DropForeignKey
ALTER TABLE `_SkillToUser` DROP FOREIGN KEY `_SkillToUser_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_SkillToUser` DROP FOREIGN KEY `_SkillToUser_ibfk_2`;

-- DropForeignKey
ALTER TABLE `_contacts` DROP FOREIGN KEY `_contacts_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_contacts` DROP FOREIGN KEY `_contacts_ibfk_2`;

-- AlterTable
ALTER TABLE `JobApplication` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `jobPostingId`,
    ADD COLUMN     `jobAppId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN     `jobPostId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`jobAppId`);

-- AlterTable
ALTER TABLE `JobPosting` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN     `jobPostId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`jobPostId`);

-- AlterTable
ALTER TABLE `Resume` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN     `resumeId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`resumeId`);

-- AlterTable
ALTER TABLE `School` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN     `schoolId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`schoolId`);

-- AlterTable
ALTER TABLE `Skill` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN     `skillId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`skillId`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN     `userId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`userId`);

-- AlterTable
ALTER TABLE `WorkExperience` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN     `workExpId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`workExpId`);

-- AddForeignKey
ALTER TABLE `JobApplication` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobApplication` ADD FOREIGN KEY (`jobPostId`) REFERENCES `JobPosting`(`jobPostId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobPosting` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resume` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `School` ADD FOREIGN KEY (`resumeId`) REFERENCES `Resume`(`resumeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkExperience` ADD FOREIGN KEY (`resumeId`) REFERENCES `Resume`(`resumeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_JobPostingToSkill` ADD FOREIGN KEY (`A`) REFERENCES `JobPosting`(`jobPostId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_JobPostingToSkill` ADD FOREIGN KEY (`B`) REFERENCES `Skill`(`skillId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SkillToUser` ADD FOREIGN KEY (`A`) REFERENCES `Skill`(`skillId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SkillToUser` ADD FOREIGN KEY (`B`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_contacts` ADD FOREIGN KEY (`A`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_contacts` ADD FOREIGN KEY (`B`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
