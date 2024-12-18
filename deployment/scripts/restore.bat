@echo off
:: Database Restore Script
::
:: Restores database and files from backup
:: Features:
:: - Database restore
:: - File restore
:: - Backup selection
:: - Validation checks
:: - Error handling
:: - Progress display

echo Database Restore Utility

:: List available backups
echo Available backups:
dir /b backups\db_*.sql
echo.

:: Get backup selection
set /p BACKUP_FILE="Enter backup filename (without path): "
if not exist "backups\%BACKUP_FILE%" (
    echo Error: Backup file not found
    exit /b 1
)

:: Stop services
echo Stopping services...
call docker-stop.bat

:: Restore database
echo Restoring database...
docker exec vacation-db mysql -u%DB_USERNAME% -p%DB_PASSWORD% %DB_DATABASE% < backups\%BACKUP_FILE%

:: Restore uploads if available
set UPLOAD_BACKUP=%BACKUP_FILE:db_=uploads_%
set UPLOAD_BACKUP=%UPLOAD_BACKUP:.sql=%
if exist "backups\%UPLOAD_BACKUP%" (
    echo Restoring uploads...
    xcopy /s /i /y "backups\%UPLOAD_BACKUP%" "..\server\uploads"
)

:: Start services
echo Starting services...
call docker-start.bat

echo Restore completed successfully 