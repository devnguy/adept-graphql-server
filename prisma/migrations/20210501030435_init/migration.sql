/*
  Warnings:

  - You are about to drop the `School` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `School` DROP FOREIGN KEY `School_ibfk_1`;

-- DropTable
DROP TABLE `School`;

-- CreateTable
CREATE TABLE `Education` (
    `educationId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `degree` VARCHAR(191) NOT NULL,
    `startDate` INTEGER NOT NULL,
    `endDate` INTEGER,
    `major` VARCHAR(191) NOT NULL,
    `gpa` DOUBLE,
    `resumeId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`educationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Education` ADD FOREIGN KEY (`resumeId`) REFERENCES `Resume`(`resumeId`) ON DELETE CASCADE ON UPDATE CASCADE;
