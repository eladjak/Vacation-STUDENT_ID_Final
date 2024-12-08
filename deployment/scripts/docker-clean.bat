@echo off
REM docker-clean.bat - Clean Docker resources

echo Cleaning Docker resources...

cd ../

REM Stop and remove containers
docker-compose down -v

REM Remove all unused containers, networks, images and volumes
docker system prune -af --volumes

if %ERRORLEVEL% NEQ 0 (
    echo Error cleaning Docker resources
    exit /b %ERRORLEVEL%
)

echo Docker resources cleaned successfully 