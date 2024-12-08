@echo off
REM docker-build.bat - Build Docker images

echo Building Docker images...

cd ../
docker-compose build

if %ERRORLEVEL% NEQ 0 (
    echo Error building Docker images
    exit /b %ERRORLEVEL%
)

echo Docker images built successfully 