@echo off
setlocal

cd /d "%~dp0"

echo [1/3] Building web assets...
call npm.cmd run build
if errorlevel 1 (
  echo Web build failed.
  pause
  exit /b 1
)

echo [2/3] Syncing Capacitor Android project...
call npx.cmd cap sync android
if errorlevel 1 (
  echo Capacitor sync failed.
  pause
  exit /b 1
)

echo [3/3] Building debug APK...
cd /d "%~dp0android"
call .\gradlew.bat assembleDebug
if errorlevel 1 (
  echo Android build failed.
  pause
  exit /b 1
)

echo APK generated at:
echo %~dp0android\app\build\outputs\apk\debug\app-debug.apk
pause

endlocal
