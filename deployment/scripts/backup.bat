@echo off
REM backup.bat

set BACKUP_DIR=backups
set TIMESTAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set BACKUP_FILE=%BACKUP_DIR%\backup_%TIMESTAMP%.sql

if not exist %BACKUP_DIR% mkdir %BACKUP_DIR%

echo Creating database backup...

cd ../
docker-compose exec db mysqldump -u root -p%DB_ROOT_PASSWORD% %DB_DATABASE% > %BACKUP_FILE%

if %ERRORLEVEL% NEQ 0 (
    echo Error creating backup
    exit /b %ERRORLEVEL%
)

echo Backup created successfully: %BACKUP_FILE% 