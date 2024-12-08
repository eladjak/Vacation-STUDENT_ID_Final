@echo off
REM docker-stop.bat - Stop Docker containers

echo Stopping Docker containers...

cd ../
docker-compose down

if %ERRORLEVEL% NEQ 0 (
    echo Error stopping Docker containers
    exit /b %ERRORLEVEL%
)

echo Docker containers stopped successfully 