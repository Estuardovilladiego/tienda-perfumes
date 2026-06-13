-- Subtotal y recargo de financiación (Sistecredito / Addi)
ALTER TABLE `Pedido` ADD COLUMN `subtotal` INTEGER NOT NULL DEFAULT 0;
ALTER TABLE `Pedido` ADD COLUMN `recargoFinanciacion` INTEGER NOT NULL DEFAULT 0;

UPDATE `Pedido` SET `subtotal` = `total` WHERE `subtotal` = 0;
