@echo off
REM ==============================================================================
REM NEON SNAKE 4K - Google Cloud Run Deployment Script (Windows)
REM ==============================================================================

set SERVICE_NAME=neon-snake-4k
set REGION=us-central1

echo =======================================================
echo  Deploying NEON SNAKE 4K to Google Cloud Run
echo =======================================================

where gcloud >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: gcloud CLI is not installed or not in PATH.
    pause
    exit /b 1
)

echo Enabling Cloud Run and Cloud Build APIs...
call gcloud services enable run.googleapis.com cloudbuild.googleapis.com

echo Submitting source build to Cloud Run...
call gcloud run deploy %SERVICE_NAME% --source . --region %REGION% --platform managed --allow-unauthenticated --port 8080 --memory 256Mi --cpu 1

echo.
echo =======================================================
echo  Deployment Complete!
call gcloud run services describe %SERVICE_NAME% --platform managed --region %REGION% --format "value(status.url)"
echo =======================================================
