@echo off
REM AI Usthad Mobile - Quick Setup Script for Windows

echo.
echo 🚀 AI Usthad Mobile - Quick Setup
echo ==================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    exit /b 1
)

echo ✅ Node.js is installed
node --version

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed.
    exit /b 1
)

echo ✅ npm is installed
npm --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo ✅ Dependencies installed successfully
echo.

REM Check if .env file exists
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ✅ .env file created
    echo.
    echo ⚠️  IMPORTANT: Please edit .env file and add your credentials:
    echo    - EXPO_PUBLIC_SUPABASE_URL
    echo    - EXPO_PUBLIC_SUPABASE_ANON_KEY
    echo    - EXPO_PUBLIC_GEMINI_API_KEY
    echo.
) else (
    echo ✅ .env file already exists
    echo.
)

REM Check if Expo CLI is installed globally
where expo >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📱 Expo CLI not found. Installing globally...
    call npm install -g expo-cli
    echo ✅ Expo CLI installed
) else (
    echo ✅ Expo CLI is already installed
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Edit .env file with your credentials
echo 2. Run 'npm start' to start the development server
echo 3. Scan QR code with Expo Go app or press 'i' for iOS / 'a' for Android
echo.
echo For detailed setup instructions, see SETUP.md
echo.

pause
