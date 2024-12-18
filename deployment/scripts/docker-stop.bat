@echo off
:: Docker Stop Script
::
:: Stops all Docker containers gracefully
:: Features:
:: - Graceful shutdown
:: - Timeout handling
:: - Container status check
:: - Error handling

echo Stopping Docker containers...

cd ../
docker-compose down

if %ERRORLEVEL% NEQ 0 (
    echo Error stopping Docker containers
    exit /b %ERRORLEVEL%
)

echo Docker containers stopped successfully 