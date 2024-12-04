@echo off
REM stop.bat

echo Stopping VacationVibe...

cd ../
docker-compose down

if %ERRORLEVEL% NEQ 0 (
    echo Error stopping containers
    exit /b %ERRORLEVEL%
)

echo VacationVibe stopped successfully 