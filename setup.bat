@echo off
echo ===================================================
echo   INTELLIGENT LEARNING PLATFORM - AUTO SETUP TOOL
echo ===================================================
echo.

:: Step 1: Install node modules
echo [1/4] Installing project dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: npm install failed. Make sure Node.js is installed correctly.
    pause
    exit /b %ERRORLEVEL%
)
echo Dependencies installed successfully.
echo.

:: Step 2: Configure Environment Variables
echo [2/4] Configuring local environment variables...
if exist .env.local (
    echo .env.local already exists. Skipping environment configuration.
) else (
    echo Creating fresh .env.local configuration.
    
    set /p DB_HOST="Enter TiDB Cloud Database Host: "
    set /p DB_USER="Enter TiDB Cloud Database User: "
    set /p DB_PASS="Enter TiDB Cloud Database Password: "
    set /p GEMINI_KEY="Enter Google Gemini API Key: "
    
    (
    echo DB_HOST=%DB_HOST%
    echo DB_PORT=4000
    echo DB_USER=%DB_USER%
    echo DB_PASSWORD="%DB_PASS%"
    echo DB_NAME=educational_platform
    echo DB_SSL=true
    echo DB_CONNECTION_LIMIT=5
    echo.
    echo JWT_SECRET=platform-auto-generated-local-secret-%RANDOM%%RANDOM%
    echo.
    echo # AI Configuration - Google Gemini
    echo AI_PROVIDER=gemini
    echo AI_API_KEY=%GEMINI_KEY%
    echo AI_MODEL=gemini-flash-lite-latest
    ) > .env.local
    
    echo .env.local has been generated and saved!
)
echo.

:: Step 3: Initialize Database schema and seed data
echo [3/4] Initializing Cloud Database Schema and Seed Data...
call npm run db:init
if %ERRORLEVEL% neq 0 (
    echo.
    echo WARNING: Database initialization failed. 
    echo Check your database credentials in .env.local and make sure your IP is whitelisted in TiDB.
)
echo.

:: Step 4: Run Development Server
echo [4/4] Starting local development server...
echo The application will be available at: http://localhost:3001
echo.
call npm run dev
pause
