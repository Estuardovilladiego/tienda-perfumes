# Exporta la BD local (XAMPP) para importar en Railway.
# Uso: .\scripts\export-mysql.ps1
# Salida: backups/essenza_export_YYYYMMDD_HHMMSS.sql

$ErrorActionPreference = "Stop"

$mysqldump = "C:\xampp\mysql\bin\mysqldump.exe"
if (-not (Test-Path $mysqldump)) {
  Write-Host "No se encontró mysqldump en $mysqldump" -ForegroundColor Red
  Write-Host "Ajusta la ruta si XAMPP está en otra carpeta."
  exit 1
}

$outDir = Join-Path $PSScriptRoot "..\backups"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$outFile = Join-Path $outDir "essenza_export_$stamp.sql"

Write-Host "Exportando essenza_perfumes → $outFile"

& $mysqldump -u root --single-transaction --routines --triggers essenza_perfumes | Set-Content -Encoding utf8 $outFile

Write-Host "✅ Export listo ($((Get-Item $outFile).Length / 1KB | ForEach-Object { '{0:N0}' -f $_ }) KB)" -ForegroundColor Green
Write-Host ""
Write-Host "Siguiente paso (Railway):"
Write-Host "  1. railway.app → New Project → MySQL"
Write-Host "  2. Copia DATABASE_URL (mysql://...)"
Write-Host "  3. Importa este SQL desde Railway Query o con mysql CLI remoto"
