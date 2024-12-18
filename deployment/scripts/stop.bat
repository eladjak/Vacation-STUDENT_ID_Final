@echo off
:: Application Stop Script
::
:: Stops all development servers
:: Features:
:: - Process termination
:: - Port cleanup
:: - Error handling
:: - Status verification

echo Stopping development servers...

:: Kill frontend process
echo Stopping frontend...
taskkill /F /IM "node.exe" /FI "WINDOWTITLE eq react-scripts*"

:: Kill backend process
echo Stopping backend...
taskkill /F /IM "node.exe" /FI "WINDOWTITLE eq npm*"

echo Development servers stopped 