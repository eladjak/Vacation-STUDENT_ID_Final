@echo off
REM restore.bat

set BACKUP_FILE=%1

if "%BACKUP_FILE%"=="" (
    echo Please provide backup file path
    exit /b 1
)

if not exist %BACKUP_FILE% (
    echo Backup file not found: %BACKUP_FILE%
    exit /b 1
)

echo Restoring database from backup...

cd ../
docker-compose exec db mysql -u root -p%DB_ROOT_PASSWORD% %DB_DATABASE% < %BACKUP_FILE%

if %ERRORLEVEL% NEQ 0 (
    echo Error restoring backup
    exit /b %ERRORLEVEL%
)

echo Database restored successfully 