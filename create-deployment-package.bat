@echo off
echo ========================================
echo   Creating Deployment Package
echo ========================================
echo.

REM Create deployment folder
if exist "hardikamakeover-website" rmdir /s /q "hardikamakeover-website"
mkdir "hardikamakeover-website"

echo Copying website files...

REM Copy main files
copy "index.html" "hardikamakeover-website\" >nul 2>&1
copy "styles.css" "hardikamakeover-website\" >nul 2>&1
copy "script.js" "hardikamakeover-website\" >nul 2>&1
copy "image-crop-config.js" "hardikamakeover-website\" >nul 2>&1
copy "slider-demo.html" "hardikamakeover-website\" >nul 2>&1
copy "image-cropping-demo.html" "hardikamakeover-website\" >nul 2>&1

REM Copy assets folder
if exist "assets" (
    xcopy "assets" "hardikamakeover-website\assets\" /E /I /Y >nul 2>&1
    echo ✓ Assets folder copied
)

REM Create README file
echo # Hardika Makeover Website > "hardikamakeover-website\README.md"
echo. >> "hardikamakeover-website\README.md"
echo Professional makeup artist website with sliding image gallery. >> "hardikamakeover-website\README.md"
echo. >> "hardikamakeover-website\README.md"
echo ## Features: >> "hardikamakeover-website\README.md"
echo - Sliding image gallery >> "hardikamakeover-website\README.md"
echo - Image cropping optimization >> "hardikamakeover-website\README.md"
echo - Mobile responsive design >> "hardikamakeover-website\README.md"
echo - Contact form integration >> "hardikamakeover-website\README.md"
echo - WhatsApp integration >> "hardikamakeover-website\README.md"
echo. >> "hardikamakeover-website\README.md"
echo ## Live Website: >> "hardikamakeover-website\README.md"
echo https://hardikamakeover.github.io >> "hardikamakeover-website\README.md"

echo.
echo ✓ Main files copied
echo ✓ README.md created
echo.

echo ========================================
echo   Deployment Package Ready!
echo ========================================
echo.
echo Your website files are ready in: hardikamakeover-website\
echo.
echo Next steps:
echo 1. Go to GitHub.com
echo 2. Create new repository: hardikamakeover.github.io
echo 3. Upload all files from hardikamakeover-website\ folder
echo 4. Enable GitHub Pages in Settings
echo.
echo Your website will be live at:
echo https://hardikamakeover.github.io
echo.
pause
