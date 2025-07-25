@echo off
color 0A
echo ========================================
echo   Hardika Makeover - Push to GitHub
echo ========================================
echo.
echo Repository: https://github.com/hardika0411/hardikamakeover.git
echo.

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed!
    echo.
    echo Please download Git from: https://git-scm.com/download/win
    echo After installing Git, run this script again.
    echo.
    pause
    exit /b 1
)

echo ✅ Git is installed
echo.

REM Check required files
echo 📁 Checking website files...
if exist "index.html" (
    echo ✅ index.html found
) else (
    echo ❌ index.html not found!
    echo Please make sure you're in the correct directory.
    pause
    exit /b 1
)

if exist "styles.css" echo ✅ styles.css found
if exist "script.js" echo ✅ script.js found
if exist "image-crop-config.js" echo ✅ image-crop-config.js found
if exist "assets\images" echo ✅ assets/images folder found

echo.

REM First time setup
if not exist ".git" (
    echo 🔧 Setting up Git repository...
    
    echo Please enter your name (e.g., Hardika):
    set /p user_name="Name: "
    
    echo Please enter your email:
    set /p user_email="Email: "
    
    echo.
    echo Configuring Git...
    git config --global user.name "%user_name%"
    git config --global user.email "%user_email%"
    
    echo Initializing repository...
    git init
    
    echo Adding remote repository...
    git remote add origin https://github.com/hardika0411/hardikamakeover.git
    
    echo ✅ Git setup complete!
    echo.
)

echo 📤 Adding files to Git...
git add .

echo 📝 Committing changes...
set commit_msg=Add Hardika Makeover website with sliding image gallery
git commit -m "%commit_msg%"

if errorlevel 1 (
    echo ⚠️ No new changes to commit, or commit failed.
    echo This might be normal if files haven't changed.
    echo.
)

echo 🚀 Pushing to GitHub...
git branch -M main
git push -u origin main

if errorlevel 1 (
    echo.
    echo ❌ Push failed. Trying to resolve...
    echo.
    echo Pulling latest changes first...
    git pull origin main --allow-unrelated-histories
    
    echo Pushing again...
    git push -u origin main
    
    if errorlevel 1 (
        echo.
        echo ❌ Still having issues. Please check:
        echo 1. Internet connection
        echo 2. GitHub login credentials
        echo 3. Repository permissions
        echo.
        echo You can also upload files directly on GitHub website:
        echo https://github.com/hardika0411/hardikamakeover
        echo.
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo   🎉 SUCCESS! Code Pushed to GitHub!
echo ========================================
echo.
echo Your website code is now on GitHub!
echo Repository: https://github.com/hardika0411/hardikamakeover
echo.
echo 🌐 NEXT STEP: Enable GitHub Pages
echo.
echo 1. Go to: https://github.com/hardika0411/hardikamakeover
echo 2. Click "Settings" tab
echo 3. Click "Pages" in left sidebar
echo 4. Source: "Deploy from a branch"
echo 5. Branch: "main"
echo 6. Click "Save"
echo.
echo 🎯 Your website will be live at:
echo https://hardika0411.github.io/hardikamakeover
echo.
echo ⏰ It takes 5-10 minutes to go live after enabling Pages.
echo.
echo ========================================
pause
