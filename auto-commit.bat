@echo off
echo ========================================
echo       RamenChan Auto Commit Script
echo ========================================
echo.

:: Get current date and time
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%DD%/%MM%/%YYYY% %HH%:%Min%"

:: Check if git is initialized
if not exist ".git" (
    echo Initializing Git repository...
    git init
    git branch -M main
    echo.
)

:: Add all changes
echo Adding all changes...
git add .

:: Check if there are changes to commit
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo No changes to commit.
    pause
    exit /b 0
)

:: Show status
echo.
echo Current status:
git status --short

:: Auto-generate commit message based on changes
echo.
echo Generating commit message...

:: Create commit message
set "commit_msg=🚀 Auto-commit: %timestamp%"

:: Check for specific file changes and add context
git diff --cached --name-only | findstr /i "\.html$" >nul && set "commit_msg=%commit_msg% - HTML updates"
git diff --cached --name-only | findstr /i "\.css$" >nul && set "commit_msg=%commit_msg% - CSS improvements"
git diff --cached --name-only | findstr /i "\.js$" >nul && set "commit_msg=%commit_msg% - JavaScript enhancements"

:: Commit changes
echo.
echo Committing with message: %commit_msg%
git commit -m "%commit_msg%"

if %errorlevel% equ 0 (
    echo.
    echo ✅ Successfully committed changes!
    
    :: Ask if user wants to push
    echo.
    set /p push_choice="Do you want to push to remote? (y/n): "
    if /i "%push_choice%"=="y" (
        echo Pushing to remote...
        git push origin main
        if %errorlevel% equ 0 (
            echo ✅ Successfully pushed to remote!
        ) else (
            echo ❌ Failed to push to remote.
        )
    )
) else (
    echo ❌ Failed to commit changes.
)

echo.
echo ========================================
echo           Process Complete
echo ========================================
pause