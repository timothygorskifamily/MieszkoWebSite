@echo off
setlocal

cd /d "%~dp0"

if not exist package.json (
  echo package.json not found in %cd%
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found on PATH. Install Node.js first.
  exit /b 1
)

if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 exit /b 1
)

echo Starting development server...
call npm run dev
