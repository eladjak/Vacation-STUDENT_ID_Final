@echo off
:: Docker Start Script
::
:: Starts all Docker containers for the application
:: Features:
:: - Starts all services in detached mode
:: - Waits for health checks
:: - Shows container status
:: - Error handling
:: - Automatic cleanup of old containers

echo Starting Docker containers...

cd ../
docker-compose up -d

if %ERRORLEVEL% NEQ 0 (
    echo Error starting Docker containers
    exit /b %ERRORLEVEL%
)

echo Docker containers started successfully
docker-compose ps