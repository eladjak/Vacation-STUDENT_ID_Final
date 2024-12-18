@echo off
:: Docker Restart Script
::
:: Restarts all Docker containers with optional rebuild
:: Features:
:: - Graceful shutdown
:: - Optional rebuild
:: - Health check waiting
:: - Container status verification
:: - Error handling
:: - Progress display

echo Restarting Docker containers...

:: Stop containers
echo Stopping containers...
call docker-stop.bat
if %ERRORLEVEL% NEQ 0 (
    echo Error stopping containers
    exit /b %ERRORLEVEL%
)

:: Optional rebuild
set /p REBUILD="Rebuild images? (y/n): "
if /i "%REBUILD%"=="y" (
    echo Rebuilding images...
    call docker-build.bat
    if %ERRORLEVEL% NEQ 0 (
        echo Error rebuilding images
        exit /b %ERRORLEVEL%
    )
)

:: Start containers
echo Starting containers...
call docker-start.bat
if %ERRORLEVEL% NEQ 0 (
    echo Error starting containers
    exit /b %ERRORLEVEL%
)

:: Verify status
echo Verifying container status...
cd ../
docker-compose ps

echo Restart completed successfully
echo Frontend: http://localhost
echo Backend: http://localhost:3001
echo Database: localhost:3306
echo Redis: localhost:6379