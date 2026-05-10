@echo off
setlocal

cd /d "%~dp0"

echo [1/8] Checking Node.js...
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or not added to PATH.
  echo Install Node.js first: https://nodejs.org/
  pause
  exit /b 1
)

echo [2/8] Checking npm...
where npm >nul 2>nul
if errorlevel 1 (
  echo npm is not available in PATH.
  echo Reinstall Node.js or fix your PATH.
  pause
  exit /b 1
)

if not exist ".env.local" (
  if exist ".env.example" (
    echo [3/8] Creating .env.local from .env.example...
    copy /y ".env.example" ".env.local" >nul
    echo Created .env.local. Update environment variables if needed.
  ) else (
    echo [3/8] Skipping .env.local creation. No .env.example found.
  )
) else (
  echo [3/8] .env.local already exists.
)

if not exist "node_modules" (
  echo [4/8] Installing dependencies...
  call npm.cmd install
  if errorlevel 1 (
    echo npm install failed.
    pause
    exit /b 1
  )
) else (
  echo [4/8] Dependencies already installed.
)

echo [5/8] Applying SQLite migrations...
call npm.cmd run db:migrate
if errorlevel 1 (
  echo SQLite migration failed.
  pause
  exit /b 1
)

echo [6/8] Seeding SQLite data...
call npm.cmd run db:seed
if errorlevel 1 (
  echo SQLite seed failed.
  pause
  exit /b 1
)

echo [7/8] Starting local API on http://127.0.0.1:8787 with DATA_STORE=sqlite ...
start "Campus Tools API" cmd /k "cd /d ""%~dp0"" && set ""DATA_STORE=sqlite"" && npm.cmd run dev:api"

echo [8/8] Starting web dev server on http://localhost:3000 ...
start "" http://localhost:3000
call npm.cmd run dev:web

endlocal
