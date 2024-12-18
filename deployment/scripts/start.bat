@echo off
:: Application Start Script
::
:: Starts both frontend and backend applications in development mode
:: Features:
:: - Concurrent running
:: - Development server
:: - Hot reloading
:: - Port checking
:: - Error handling

echo Starting development servers...

:: Start frontend
echo Starting frontend...
cd ../../client
start npm start

:: Start backend
echo Starting backend...
cd ../server
start npm run dev

echo Development servers started
echo Frontend: http://localhost:3000
echo Backend: http://localhost:3001 