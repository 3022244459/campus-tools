@echo off
setlocal

cd /d "%~dp0"

echo [1/5] Checking Node.js...
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or not added to PATH.
  echo Install Node.js first: https://nodejs.org/
  pause
  exit /b 1
)

echo [2/5] Checking npm...
where npm >nul 2>nul
if errorlevel 1 (
  echo npm is not available in PATH.
  echo Reinstall Node.js or fix your PATH.
  pause
  exit /b 1
)

if not exist ".env.local" (
  if exist ".env.example" (
    echo [3/5] Creating .env.local from .env.example...
    copy /y ".env.example" ".env.local" >nul
    echo Created .env.local. Update GEMINI_API_KEY if your app needs it.
  ) else (
    echo [3/5] Skipping .env.local creation. No .env.example found.
  )
) else (
  echo [3/5] .env.local already exists.
)

if not exist "node_modules" (
  echo [4/5] Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo npm install failed.
    pause
    exit /b 1
  )
) else (
  echo [4/5] Dependencies already installed.
)

echo [5/5] Starting dev server on http://localhost:3000 ...
start "" http://localhost:3000
call npm run dev

endlocal
