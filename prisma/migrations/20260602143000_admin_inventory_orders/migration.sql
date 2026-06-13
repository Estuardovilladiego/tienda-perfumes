-- AlterTable
ALTER TABLE `Producto`
  ADD COLUMN `imagenes` JSON NULL;

-- AlterTable
ALTER TABLE `Pedido`
  ADD COLUMN `numero` VARCHAR(191) NULL,
  ADD COLUMN `direccion` VARCHAR(191) NOT NULL DEFAULT '',
  ADD COLUMN `metodoPago` VARCHAR(191) NOT NULL DEFAULT 'WhatsApp',
  MODIFY `estado` ENUM('pendiente', 'confirmado', 'preparando', 'enviado', 'entregado', 'cancelado') NOT NULL DEFAULT 'pendiente';

-- Backfill stable order numbers for existing rows before enforcing uniqueness.
UPDATE `Pedido`
SET `numero` = CONCAT('ESS-', LPAD(`id`, 6, '0'))
WHERE `numero` IS NULL;

-- AlterTable
ALTER TABLE `Pedido`
  MODIFY `numero` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Pedido_numero_key` ON `Pedido`(`numero`);

-- CreateTable
CREATE TABLE `InventarioMovimiento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productoId` INTEGER NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `stockAnterior` INTEGER NOT NULL,
    `stockNuevo` INTEGER NOT NULL,
    `motivo` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `InventarioMovimiento_productoId_idx`(`productoId`),
    INDEX `InventarioMovimiento_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InventarioMovimiento` ADD CONSTRAINT `InventarioMovimiento_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
