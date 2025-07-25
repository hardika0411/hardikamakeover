@echo off
color 0A
echo ========================================
echo   Hardika Makeover - Git Push Script
echo ========================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed!
    echo Please download and install Git from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo ✅ Git is installed
echo.

REM Check if this is first time setup
if not exist ".git" (
    echo 🔧 First time setup detected...
    echo.
    
    echo Please enter your GitHub username:
    set /p username="Username: "
    
    echo.
    echo Please enter your email:
    set /p email="Email: "
    
    echo.
    echo Setting up Git configuration...
    git config --global user.name "%username%"
    git config --global user.email "%email%"
    
    echo.
    echo Initializing Git repository...
    git init
    
    echo.
    echo Using your GitHub repository:
    echo https://github.com/hardika0411/hardikamakeover.git
    set repo_url=https://github.com/hardika0411/hardikamakeover.git

    echo.
    echo Adding remote origin...
    git remote add origin %repo_url%
    
    echo ✅ Git setup complete!
    echo.
)

echo 📁 Checking files...
if exist "index.html" (
    echo ✅ index.html found
) else (
    echo ❌ index.html not found!
    echo Please make sure you're in the correct directory.
    pause
    exit /b 1
)

if exist "styles.css" (
    echo ✅ styles.css found
) else (
    echo ❌ styles.css not found!
)

if exist "script.js" (
    echo ✅ script.js found
) else (
    echo ❌ script.js not found!
)

echo.
echo 📤 Adding files to Git...
git add .

if errorlevel 1 (
    echo ❌ Failed to add files
    pause
    exit /b 1
)

echo ✅ Files added successfully
echo.

echo 💬 Enter commit message (or press Enter for default):
set /p commit_msg="Commit message: "

if "%commit_msg%"=="" (
    set commit_msg=Updated Hardika Makeover website
)

echo.
echo 📝 Committing changes...
git commit -m "%commit_msg%"

if errorlevel 1 (
    echo ❌ Failed to commit changes
    echo This might be because there are no changes to commit.
    pause
    exit /b 1
)

echo ✅ Changes committed successfully
echo.

echo 🚀 Pushing to GitHub...
git push -u origin main

if errorlevel 1 (
    echo ❌ Failed to push to GitHub
    echo.
    echo Possible solutions:
    echo 1. Check your internet connection
    echo 2. Verify your GitHub repository URL
    echo 3. Make sure you have push permissions
    echo 4. Try: git pull origin main --allow-unrelated-histories
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   🎉 SUCCESS! Website Pushed to Git!
echo ========================================
echo.
echo Your website has been successfully pushed to GitHub!
echo.
echo Next steps:
echo 1. Go to your GitHub repository
echo 2. Enable GitHub Pages in Settings
echo 3. Your website will be live at:
echo    https://yourusername.github.io/hardikamakeover.github.io
echo.
echo It may take 5-10 minutes for your website to go live.
echo.
echo ========================================
pause
