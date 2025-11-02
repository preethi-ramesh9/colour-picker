#!/bin/bash

# Deployment script for Color Picker React App
# This script can be used in Jenkins pipeline for deployment

set -e

echo "Starting deployment process..."

# Configuration
BUILD_DIR="build"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/html}"

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo "Error: Build directory not found!"
    exit 1
fi

# Optional: Backup existing deployment
if [ -d "$DEPLOY_PATH" ]; then
    echo "Creating backup..."
    BACKUP_DIR="${DEPLOY_PATH}_backup_$(date +%Y%m%d_%H%M%S)"
    cp -r "$DEPLOY_PATH" "$BACKUP_DIR"
    echo "Backup created at: $BACKUP_DIR"
fi

# Deploy build files
echo "Deploying files to $DEPLOY_PATH..."
mkdir -p "$DEPLOY_PATH"
cp -r "$BUILD_DIR"/* "$DEPLOY_PATH"

# Set proper permissions (adjust as needed)
chmod -R 755 "$DEPLOY_PATH"

echo "Deployment completed successfully!"
echo "Files deployed to: $DEPLOY_PATH"
