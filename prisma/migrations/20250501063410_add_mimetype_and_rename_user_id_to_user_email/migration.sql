/*
  Warnings:

  - You are about to drop the column `userId` on the `files` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,extension,mimeType]` on the table `files` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mimeType` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `files` DROP FOREIGN KEY `files_userId_fkey`;

-- DropIndex
DROP INDEX `files_name_extension_type_key` ON `files`;

-- DropIndex
DROP INDEX `files_userId_name_extension_type_idx` ON `files`;

-- AlterTable
ALTER TABLE `files` DROP COLUMN `userId`,
    ADD COLUMN `mimeType` VARCHAR(191) NOT NULL,
    ADD COLUMN `userEmail` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `files_userEmail_name_type_idx` ON `files`(`userEmail`, `name`, `type`);

-- CreateIndex
CREATE UNIQUE INDEX `files_name_extension_mimeType_key` ON `files`(`name`, `extension`, `mimeType`);

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_userEmail_fkey` FOREIGN KEY (`userEmail`) REFERENCES `users`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
