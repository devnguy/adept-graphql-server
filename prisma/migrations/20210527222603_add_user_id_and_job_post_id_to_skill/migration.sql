-- AlterTable
ALTER TABLE `Skill` ADD COLUMN `jobPostId` VARCHAR(191),
    ADD COLUMN `userId` VARCHAR(191);

-- AddForeignKey
ALTER TABLE `Skill` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Skill` ADD FOREIGN KEY (`jobPostId`) REFERENCES `JobPosting`(`jobPostId`) ON DELETE SET NULL ON UPDATE CASCADE;