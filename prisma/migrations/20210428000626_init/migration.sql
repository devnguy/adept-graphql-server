/*
  Warnings:

  - The primary key for the `JobApplication` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `JobPosting` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Resume` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `School` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Skill` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `WorkExperience` table will be changed. If it partially fails, the table could be left without primary key constraint.

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
    MODIFY `userId` VARCHAR(191) NOT NULL,
    MODIFY `jobAppId` VARCHAR(191) NOT NULL,
    MODIFY `jobPostId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`jobAppId`);

-- AlterTable
ALTER TABLE `JobPosting` DROP PRIMARY KEY,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    MODIFY `jobPostId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`jobPostId`);

-- AlterTable
ALTER TABLE `Resume` DROP PRIMARY KEY,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    MODIFY `resumeId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`resumeId`);

-- AlterTable
ALTER TABLE `School` DROP PRIMARY KEY,
    MODIFY `resumeId` VARCHAR(191) NOT NULL,
    MODIFY `schoolId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`schoolId`);

-- AlterTable
ALTER TABLE `Skill` DROP PRIMARY KEY,
    MODIFY `skillId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`skillId`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`userId`);

-- AlterTable
ALTER TABLE `WorkExperience` DROP PRIMARY KEY,
    MODIFY `resumeId` VARCHAR(191) NOT NULL,
    MODIFY `workExpId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`workExpId`);

-- AlterTable
ALTER TABLE `_JobPostingToSkill` MODIFY `A` VARCHAR(191) NOT NULL,
    MODIFY `B` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `_SkillToUser` MODIFY `A` VARCHAR(191) NOT NULL,
    MODIFY `B` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `_contacts` MODIFY `A` VARCHAR(191) NOT NULL,
    MODIFY `B` VARCHAR(191) NOT NULL;

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
