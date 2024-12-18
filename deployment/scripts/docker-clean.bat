@echo off
:: Docker Clean Script
::
:: Cleans up Docker resources
:: Features:
:: - Stops all containers
:: - Removes containers
:: - Removes images
:: - Removes volumes
:: - Removes networks
:: - Error handling

echo Cleaning Docker resources...
cd ../

docker-compose down -v
docker system prune -f

if %ERRORLEVEL% NEQ 0 (
    echo Error cleaning Docker resources
    exit /b %ERRORLEVEL%
)

echo Docker resources cleaned successfully
echo Note: You may need to rebuild images with docker-build.bat