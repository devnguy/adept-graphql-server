/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[jobAppId]` on the table `JobApplication` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[jobPostId]` on the table `JobPosting` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[skillId]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[educationId]` on the table `Education` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workExpId]` on the table `WorkExperience` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resumeId]` on the table `Resume` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `JobPosting.jobPostId_index` ON `JobPosting`;

-- DropIndex
DROP INDEX `Education.educationId_index` ON `Education`;

-- DropIndex
DROP INDEX `JobApplication.jobAppId_index` ON `JobApplication`;

-- DropIndex
DROP INDEX `Resume.resumeId_index` ON `Resume`;

-- DropIndex
DROP INDEX `User.userId_index` ON `User`;

-- DropIndex
DROP INDEX `WorkExperience.workExpId_index` ON `WorkExperience`;

-- DropIndex
DROP INDEX `Skill.skillId_index` ON `Skill`;

-- CreateIndex
CREATE UNIQUE INDEX `User.userId_unique` ON `User`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `JobApplication.jobAppId_unique` ON `JobApplication`(`jobAppId`);

-- CreateIndex
CREATE UNIQUE INDEX `JobPosting.jobPostId_unique` ON `JobPosting`(`jobPostId`);

-- CreateIndex
CREATE UNIQUE INDEX `Skill.skillId_unique` ON `Skill`(`skillId`);

-- CreateIndex
CREATE UNIQUE INDEX `Education.educationId_unique` ON `Education`(`educationId`);

-- CreateIndex
CREATE UNIQUE INDEX `WorkExperience.workExpId_unique` ON `WorkExperience`(`workExpId`);

-- CreateIndex
CREATE UNIQUE INDEX `Resume.resumeId_unique` ON `Resume`(`resumeId`);
