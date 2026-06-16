-- Decants: variantes por volumen y acordes principales
ALTER TABLE `Producto`
  ADD COLUMN `decantBaseSlug` VARCHAR(191) NULL,
  ADD COLUMN `acordesPrincipales` JSON NULL;

CREATE INDEX `Producto_decantBaseSlug_idx` ON `Producto`(`decantBaseSlug`);
