-- DropIndex
DROP INDEX `users_email_idx` ON `users`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    MODIFY `password` VARCHAR(255) NOT NULL;
