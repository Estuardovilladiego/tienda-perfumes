-- Catálogo extendido: marcas, familias olfativas, M2M categorías (baseline si ya aplicaste db push).

-- DropForeignKey
ALTER TABLE `Producto` DROP FOREIGN KEY `Producto_categoriaId_fkey`;

-- DropIndex
DROP INDEX `Producto_categoriaId_idx` ON `Producto`;

-- AlterTable
ALTER TABLE `Producto` DROP COLUMN `categoriaId`,
    ADD COLUMN `enOferta` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `esNuevo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `familiaId` INTEGER NULL,
    ADD COLUMN `marcaId` INTEGER NULL,
    ADD COLUMN `notasCorazon` TEXT NULL,
    ADD COLUMN `notasFondo` TEXT NULL,
    ADD COLUMN `notasSalida` TEXT NULL,
    ADD COLUMN `sku` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `producto_categoria` (
    `productoId` INTEGER NOT NULL,
    `categoriaId` INTEGER NOT NULL,

    INDEX `producto_categoria_categoriaId_idx`(`categoriaId`),
    PRIMARY KEY (`productoId`, `categoriaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FamiliaOlfativa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `descripcion` TEXT NULL,

    UNIQUE INDEX `FamiliaOlfativa_nombre_key`(`nombre`),
    UNIQUE INDEX `FamiliaOlfativa_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Marca` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Marca_nombre_key`(`nombre`),
    UNIQUE INDEX `Marca_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Producto_sku_key` ON `Producto`(`sku`);

-- CreateIndex
CREATE INDEX `Producto_activo_esNuevo_idx` ON `Producto`(`activo`, `esNuevo`);

-- CreateIndex
CREATE INDEX `Producto_activo_enOferta_idx` ON `Producto`(`activo`, `enOferta`);

-- CreateIndex
CREATE INDEX `Producto_familiaId_idx` ON `Producto`(`familiaId`);

-- CreateIndex
CREATE INDEX `Producto_marcaId_idx` ON `Producto`(`marcaId`);

-- AddForeignKey
ALTER TABLE `producto_categoria` ADD CONSTRAINT `producto_categoria_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `producto_categoria` ADD CONSTRAINT `producto_categoria_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_familiaId_fkey` FOREIGN KEY (`familiaId`) REFERENCES `FamiliaOlfativa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_marcaId_fkey` FOREIGN KEY (`marcaId`) REFERENCES `Marca`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
