@echo off
echo Starting Docker deployment...

REM Check Docker
docker info > nul 2>&1
if errorlevel 1 (
    echo Docker is not running! Please start Docker Desktop.
    pause
    exit /b 1
)

REM Check XAMPP
netstat -ano | findstr ":3306" > nul
if not errorlevel 1 (
    echo Port 3306 is in use! Please close XAMPP/MySQL.
    pause
    exit /b 1
)

echo.
echo [1/4] Stopping containers...
docker-compose -f ../docker-compose.yml down
if errorlevel 1 goto error

echo.
echo [2/4] Cleaning system...
docker system prune -af --volumes
if errorlevel 1 goto error

echo.
echo [3/4] Building images...
docker-compose -f ../docker-compose.yml build
if errorlevel 1 goto error

echo.
echo [4/4] Starting services...
docker-compose -f ../docker-compose.yml up -d
if errorlevel 1 goto error

echo.
echo Deployment successful!
echo.
echo Frontend: http://localhost
echo Backend: http://localhost:3001
echo.
echo Starting logs (Ctrl+C to exit)...
timeout /t 5
docker-compose -f ../docker-compose.yml logs -f
exit /b 0

:error
echo.
echo Deployment failed!
pause
exit /b 1