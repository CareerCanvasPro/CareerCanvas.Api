#!/bin/bash

# Colors for console outputs
ERROR='\033[0;31m'
WARNING='\033[1;33m'
SUCCESS='\033[0;32m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Exit immediately if a command exits with a non-zero status
set -e

# Step 1: Pull the latest code from the repository
echo -e "${PURPLE}[Deploy.sh]:${NC} Pulling latest code..."
git pull origin $(git rev-parse --abbrev-ref HEAD)

# Step 2: Build the project using Lerna
echo -e "${PURPLE}[Deploy.sh]:${NC} Building project..."
npx lerna run tsc

# Step 3: Deploy ecosystem files using PM2
ecosystem_files=(
    "./services/auth/ecosystem.config.js"
    "./services/media/ecosystem.config.js"
    "./services/user-management/ecosystem.config.js"
)

echo -e "${PURPLE}[Deploy.sh]:${NC} Deploying services..."
for file in "${ecosystem_files[@]}"; do
    app_name=$(node -pe "require('$file').apps[0].name")
    if pm2 list | grep -q "$app_name"; then
        echo -e "${PURPLE}[Deploy.sh]:${NC} Restarting $app_name..."
        pm2 restart "$file" --update-env
    else
        echo -e "${PURPLE}[Deploy.sh]:${NC} Starting $app_name..."
        pm2 start "$file"
    fi
done

echo -e "${PURPLE}[Deploy.sh]:${NC} Saving current pm2 process list..."
pm2 save

# Display PM2 process list
echo -e "${PURPLE}[Deploy.sh]:${NC} Deployment complete! Current PM2 processes:"
pm2 list
