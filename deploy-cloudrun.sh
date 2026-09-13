#!/bin/bash
# ==============================================================================
# NEON SNAKE 4K - Google Cloud Run Deployment Script
# ==============================================================================

set -e

SERVICE_NAME="neon-snake-4k"
REGION="us-central1"

echo "======================================================="
echo " Deploying NEON SNAKE 4K to Google Cloud Run"
echo "======================================================="

# Ensure gcloud is authenticated
if ! command -v gcloud &> /dev/null; then
    echo "Error: gcloud CLI is not installed or not in PATH."
    exit 1
fi

# Get current GCP project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "(unset)" ]; then
    echo "No Google Cloud project set. Please select or set your project:"
    read -p "Enter GCP Project ID: " PROJECT_ID
    gcloud config set project "$PROJECT_ID"
fi

echo "Active Project: $PROJECT_ID"
echo "Target Region:  $REGION"
echo "Service Name:   $SERVICE_NAME"
echo ""

# Enable required Google Cloud APIs
echo "Enabling Cloud Run and Cloud Build APIs..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com

# Deploy container directly from source using Cloud Build
echo "Submitting build and deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
    --source . \
    --region "$REGION" \
    --platform managed \
    --allow-unauthenticated \
    --port 8080 \
    --memory 256Mi \
    --cpu 1

echo ""
echo "======================================================="
echo " Deployment Complete!"
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --platform managed --region "$REGION" --format 'value(status.url)')
echo " Public Live Game URL: $SERVICE_URL"
echo "======================================================="
