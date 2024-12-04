@echo off
REM build.bat

echo Building Docker images...

cd ../
docker-compose build

if %ERRORLEVEL% NEQ 0 (
    echo Error building Docker images
    exit /b %ERRORLEVEL%
)

echo Docker images built successfully 