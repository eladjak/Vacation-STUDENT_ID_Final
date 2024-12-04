@echo off
REM start.bat

echo Starting VacationVibe...

cd ../
docker-compose up -d

if %ERRORLEVEL% NEQ 0 (
    echo Error starting containers
    exit /b %ERRORLEVEL%
)

echo VacationVibe started successfully
echo Frontend: http://localhost
echo Backend: http://localhost:3001 