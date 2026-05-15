-- CreateTable
CREATE TABLE `Member` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `surname` VARCHAR(191) NOT NULL DEFAULT '',
    `uni` VARCHAR(191) NOT NULL,
    `studium` VARCHAR(191) NOT NULL,
    `type` ENUM('STUDENT', 'ALUMNI') NOT NULL,
    `status` ENUM('ACTIVE', 'EXPIRED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `stripeId` VARCHAR(191) NULL,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NULL,
    `lastRenewalAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Member_email_key`(`email`),
    UNIQUE INDEX `Member_stripeId_key`(`stripeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `imageMimeType` VARCHAR(191) NOT NULL,
    `imageData` LONGBLOB NOT NULL,
    `cardLinkPath` VARCHAR(191) NULL,
    `eventAt` DATETIME(3) NULL,
    `venue` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Post_cardLinkPath_idx`(`cardLinkPath`),
    INDEX `Post_eventAt_idx`(`eventAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VargjetTopic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `VargjetTopic_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VargjetDocument` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `topicId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `originalFileName` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `fileData` LONGBLOB NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `VargjetDocument_topicId_idx`(`topicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventGalleryImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventSlug` VARCHAR(191) NOT NULL,
    `editionYear` INTEGER NOT NULL DEFAULT 2024,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `slideshowGroupId` VARCHAR(191) NULL,
    `slideshowIndex` INTEGER NOT NULL DEFAULT 0,
    `mimeType` VARCHAR(191) NOT NULL,
    `fileData` LONGBLOB NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `EventGalleryImage_eventSlug_editionYear_idx`(`eventSlug`, `editionYear`),
    INDEX `EventGalleryImage_eventSlug_idx`(`eventSlug`),
    INDEX `EventGalleryImage_eventSlug_editionYear_sortOrder_idx`(`eventSlug`, `editionYear`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VargjetDocument` ADD CONSTRAINT `VargjetDocument_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `VargjetTopic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

