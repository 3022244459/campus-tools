@echo off
setlocal

cd /d "%~dp0"

echo [1/5] Checking Java toolchain...
node scripts\check-java.mjs 17
if errorlevel 1 (
  echo Android Gradle plugin requires Java 17 or newer. Set JAVA_HOME to a JDK 17+ installation before building Android APKs.
  pause
  exit /b 1
)

echo [2/5] Running project checks...
call npm.cmd run check
if errorlevel 1 (
  echo Project checks failed.
  pause
  exit /b 1
)

echo [3/5] Building web assets...
call npm.cmd run build
if errorlevel 1 (
  echo Web build failed.
  pause
  exit /b 1
)

echo [4/5] Syncing Capacitor Android project...
call npx.cmd cap sync android
if errorlevel 1 (
  echo Capacitor sync failed.
  pause
  exit /b 1
)

set SIGNING_CONFIGURED=0
set SIGNING_MISSING=0
if not "%ANDROID_KEYSTORE_PATH%"=="" set SIGNING_CONFIGURED=1
if not "%ANDROID_KEYSTORE_PASSWORD%"=="" set SIGNING_CONFIGURED=1
if not "%ANDROID_KEY_ALIAS%"=="" set SIGNING_CONFIGURED=1
if not "%ANDROID_KEY_PASSWORD%"=="" set SIGNING_CONFIGURED=1
if "%ANDROID_KEYSTORE_PATH%"=="" set SIGNING_MISSING=1
if "%ANDROID_KEYSTORE_PASSWORD%"=="" set SIGNING_MISSING=1
if "%ANDROID_KEY_ALIAS%"=="" set SIGNING_MISSING=1
if "%ANDROID_KEY_PASSWORD%"=="" set SIGNING_MISSING=1

if "%SIGNING_CONFIGURED%"=="1" if "%SIGNING_MISSING%"=="1" (
  echo Incomplete signing env vars. Set all of ANDROID_KEYSTORE_PATH, ANDROID_KEYSTORE_PASSWORD, ANDROID_KEY_ALIAS and ANDROID_KEY_PASSWORD, or leave all empty for an unsigned internal build.
  pause
  exit /b 1
)

if "%SIGNING_CONFIGURED%"=="1" if not exist "%ANDROID_KEYSTORE_PATH%" (
  echo ANDROID_KEYSTORE_PATH does not exist: %ANDROID_KEYSTORE_PATH%
  pause
  exit /b 1
)

if "%SIGNING_CONFIGURED%"=="0" (
  echo Signing env vars are not configured. Gradle will create an unsigned release artifact.
  echo Required for signed release: ANDROID_KEYSTORE_PATH, ANDROID_KEYSTORE_PASSWORD, ANDROID_KEY_ALIAS, ANDROID_KEY_PASSWORD
)

echo [5/5] Building release APK...
cd /d "%~dp0android"
call .\gradlew.bat assembleRelease
if errorlevel 1 (
  echo Android release build failed.
  pause
  exit /b 1
)

echo Release artifact generated under:
echo %~dp0android\app\build\outputs\apk\release
pause

endlocal
