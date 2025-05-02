/*
  Warnings:

  - A unique constraint covering the columns `[name,extension,type]` on the table `files` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `files_name_extension_type_key` ON `files`(`name`, `extension`, `type`);
