@echo off
setlocal

cd /d "%~dp0"

echo [1/4] Checking Java toolchain...
node scripts\check-java.mjs 17
if errorlevel 1 (
  echo Android Gradle plugin requires Java 17 or newer. Set JAVA_HOME to a JDK 17+ installation before building Android APKs.
  pause
  exit /b 1
)

echo [2/4] Building web assets...
call npm.cmd run build
if errorlevel 1 (
  echo Web build failed.
  pause
  exit /b 1
)

echo [3/4] Syncing Capacitor Android project...
call npx.cmd cap sync android
if errorlevel 1 (
  echo Capacitor sync failed.
  pause
  exit /b 1
)

echo [4/4] Building debug APK...
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
