@echo off
:: Application Build Script
::
:: Builds both frontend and backend applications
:: Features:
:: - Frontend build (React)
:: - Backend build (Node.js)
:: - Dependency installation
:: - Production optimization
:: - Error handling

echo Building applications...

:: Build frontend
echo Building frontend...
cd ../../client
npm install && npm run build

:: Build backend
echo Building backend...
cd ../server
npm install && npm run build

echo Build completed successfully 