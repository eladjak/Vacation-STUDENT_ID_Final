@echo off
:: Docker Build Script
::
:: Builds all Docker images for the application
:: Features:
:: - Builds frontend image
:: - Builds backend image
:: - Uses production configuration
:: - Shows build progress
:: - Error handling

echo Building Docker images...
cd ../
docker-compose build --no-cache

if %ERRORLEVEL% NEQ 0 (
    echo Error building Docker images
    exit /b %ERRORLEVEL%
)

echo Docker images built successfully