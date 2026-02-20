@echo off
REM Run MySQL schema - update path and credentials as needed
REM Usage: setup-db.bat
REM Or: mysql -u avnadmin -pAVNS_pb24Tmte7BAwwjBQfM3 -h localhost < backend\schema.sql

echo Running schema.sql...
mysql -u avnadmin -pAVNS_pb24Tmte7BAwwjBQfM3 -h localhost kodbanking < backend\schema.sql 2>nul
if %errorlevel% neq 0 (
  echo.
  echo If mysql command not found, run schema manually:
  echo 1. Open MySQL Workbench or Aiven Query tab
  echo 2. Copy contents of backend\schema.sql
  echo 3. Execute
) else (
  echo Database setup complete.
)
