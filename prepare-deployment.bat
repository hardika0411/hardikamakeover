@echo off
echo ========================================
echo   Hardika Makeover - Deployment Prep
echo ========================================
echo.

echo Checking required files...
echo.

REM Check if main files exist
if exist "index.html" (
    echo ✓ index.html found
) else (
    echo ✗ index.html missing
)

if exist "styles.css" (
    echo ✓ styles.css found
) else (
    echo ✗ styles.css missing
)

if exist "script.js" (
    echo ✓ script.js found
) else (
    echo ✗ script.js missing
)

if exist "image-crop-config.js" (
    echo ✓ image-crop-config.js found
) else (
    echo ✗ image-crop-config.js missing
)

echo.
echo Checking assets folder...

if exist "assets\images" (
    echo ✓ assets/images folder found
) else (
    echo ✗ assets/images folder missing
    echo Creating assets/images folder...
    mkdir "assets\images"
)

echo.
echo Checking image files...

if exist "assets\images\p0.jpg" (
    echo ✓ p0.jpg found
) else (
    echo ✗ p0.jpg missing
)

if exist "assets\images\p1.jpg" (
    echo ✓ p1.jpg found
) else (
    echo ✗ p1.jpg missing
)

if exist "assets\images\p2.jpg" (
    echo ✓ p2.jpg found
) else (
    echo ✗ p2.jpg missing
)

if exist "assets\images\p3.jpg" (
    echo ✓ p3.jpg found
) else (
    echo ✗ p3.jpg missing
)

if exist "assets\images\hardikalogo.png" (
    echo ✓ hardikalogo.png found
) else (
    echo ✗ hardikalogo.png missing
)

echo.
echo ========================================
echo Creating deployment package...
echo ========================================

REM Create deployment folder
if not exist "deployment" mkdir deployment

REM Copy main files
copy "index.html" "deployment\" >nul 2>&1
copy "styles.css" "deployment\" >nul 2>&1
copy "script.js" "deployment\" >nul 2>&1
copy "image-crop-config.js" "deployment\" >nul 2>&1

REM Copy assets folder
if exist "assets" (
    xcopy "assets" "deployment\assets\" /E /I /Y >nul 2>&1
)

echo ✓ Files copied to deployment folder
echo.

echo ========================================
echo   Deployment Package Ready!
echo ========================================
echo.
echo Your website files are ready in the 'deployment' folder.
echo.
echo Next steps:
echo 1. Open deploy-checklist.html to verify everything
echo 2. Choose a hosting provider (GitHub Pages recommended)
echo 3. Upload the contents of the 'deployment' folder
echo.
echo Recommended hosting:
echo • GitHub Pages (Free): https://github.com
echo • Netlify (Free): https://netlify.com
echo • Hostinger (Paid): https://hostinger.in
echo.
pause
