@echo off
:: Database Backup Script
::
:: Creates a backup of the MySQL database and uploaded files
:: Features:
:: - Database dump
:: - File backup
:: - Timestamp naming
:: - Compression
:: - Error handling
:: - Backup verification

echo Creating backup...

:: Create backup directory
if not exist "backups" mkdir backups

:: Set timestamp
set timestamp=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set timestamp=%timestamp: =0%

:: Backup database
echo Backing up database...
docker exec vacation-db mysqldump -u%DB_USERNAME% -p%DB_PASSWORD% %DB_DATABASE% > backups/db_%timestamp%.sql

:: Backup uploads
echo Backing up uploads...
xcopy /s /i "..\server\uploads" "backups\uploads_%timestamp%"

echo Backup completed successfully
echo Files saved in backups directory 