@echo off
REM docker-start.bat - Start Docker containers

echo Starting Docker containers...

cd ../
docker-compose up -d

if %ERRORLEVEL% NEQ 0 (
    echo Error starting Docker containers
    exit /b %ERRORLEVEL%
)

echo Docker containers started successfully
echo Frontend: http://localhost
echo Backend: http://localhost:3001
echo Redis: localhost:6379 