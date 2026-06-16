-- Quitar slug de variantes duplicadas; acordes se mantienen en el producto único
ALTER TABLE `Producto` DROP INDEX `Producto_decantBaseSlug_idx`;
ALTER TABLE `Producto` DROP COLUMN `decantBaseSlug`;
