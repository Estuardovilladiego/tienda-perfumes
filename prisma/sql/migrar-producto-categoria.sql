-- Migración: una categoría por producto → muchos a muchos
-- Ejecutar en MySQL (phpMyAdmin o CLI) sobre essenza_perfumes
-- Hace backup implícito: copia categoriaId a producto_categoria antes de eliminar la columna

USE essenza_perfumes;

-- 1. Tabla intermedia (si no existe)
CREATE TABLE IF NOT EXISTS producto_categoria (
  producto_id INT NOT NULL,
  categoria_id INT NOT NULL,
  PRIMARY KEY (producto_id, categoria_id),
  CONSTRAINT fk_pc_producto
    FOREIGN KEY (producto_id) REFERENCES Producto(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pc_categoria
    FOREIGN KEY (categoria_id) REFERENCES Categoria(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_pc_categoria (categoria_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Copiar relaciones existentes (columna categoriaId en Producto)
INSERT IGNORE INTO producto_categoria (producto_id, categoria_id)
SELECT id, categoriaId
FROM Producto
WHERE categoriaId IS NOT NULL;

-- 3. Eliminar FK y columna antigua (ajusta el nombre del FK si phpMyAdmin lo muestra distinto)
-- SHOW CREATE TABLE Producto;  -- para ver el nombre exacto de la FK
ALTER TABLE Producto DROP FOREIGN KEY Producto_categoriaId_fkey;
ALTER TABLE Producto DROP INDEX Producto_categoriaId_idx;
ALTER TABLE Producto DROP COLUMN categoriaId;

-- --- Consultas de ejemplo (filtros por categoría) ---

-- Perfumes de Hombre (incluye árabes masculinos)
-- SELECT p.* FROM Producto p
-- INNER JOIN producto_categoria pc ON pc.producto_id = p.id
-- INNER JOIN Categoria c ON c.id = pc.categoria_id
-- WHERE p.activo = 1 AND c.slug = 'hombre';

-- Perfumes árabes (cualquier género)
-- SELECT p.* FROM Producto p
-- INNER JOIN producto_categoria pc ON pc.producto_id = p.id
-- INNER JOIN Categoria c ON c.id = pc.categoria_id
-- WHERE p.activo = 1 AND c.slug = 'arabes';

-- Asad: Hombre + Árabes
-- SELECT p.nombre, GROUP_CONCAT(c.nombre ORDER BY c.orden) AS categorias
-- FROM Producto p
-- INNER JOIN producto_categoria pc ON pc.producto_id = p.id
-- INNER JOIN Categoria c ON c.id = pc.categoria_id
-- WHERE p.nombre = 'Asad'
-- GROUP BY p.id;

-- Conteo por categoría (un producto cuenta en cada categoría que tenga)
-- SELECT c.slug, COUNT(DISTINCT pc.producto_id) AS total
-- FROM Categoria c
-- LEFT JOIN producto_categoria pc ON pc.categoria_id = c.id
-- LEFT JOIN Producto p ON p.id = pc.producto_id AND p.activo = 1
-- GROUP BY c.id, c.slug
-- ORDER BY c.orden;
