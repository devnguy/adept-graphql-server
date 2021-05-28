-- CreateIndex
CREATE INDEX `User.userId_index` ON `User`(`userId`);

-- CreateIndex
CREATE INDEX `JobApplication.jobAppId_index` ON `JobApplication`(`jobAppId`);

-- CreateIndex
CREATE INDEX `JobPosting.jobPostId_index` ON `JobPosting`(`jobPostId`);

-- CreateIndex
CREATE INDEX `Skill.skillId_index` ON `Skill`(`skillId`);

-- CreateIndex
CREATE INDEX `Education.educationId_index` ON `Education`(`educationId`);

-- CreateIndex
CREATE INDEX `WorkExperience.workExpId_index` ON `WorkExperience`(`workExpId`);

-- CreateIndex
CREATE INDEX `Resume.resumeId_index` ON `Resume`(`resumeId`);
