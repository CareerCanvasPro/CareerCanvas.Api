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

# Step 2: Find all ecosystem.config.js files in subdirectories of ./services/
ecosystem_files=($(find ./services -mindepth 2 -type f -name "ecosystem.config.js"))

if [ ${#ecosystem_files[@]} -eq 0 ]; then
    echo -e "${ERROR}[Deploy.sh]: No ecosystem.config.js files found!${NC}"
    exit 1
fi

# Print ecosystem files found in the project
echo -e "${PURPLE}[Deploy.sh]:${NC} Found ${#ecosystem_files[@]} ecosystem files:"
rows=()
for file in "${ecosystem_files[@]}"; do
    app_name=$(node -pe "require('$file').apps[0].name")
    rows+=("$app_name | : $file")
done
printf "%s\n" "${rows[@]}" | column -t -s '|'
echo ""

# Step 3: Build the project using Lerna
echo -e "${PURPLE}[Deploy.sh]:${NC} Building project using lerna..."
npx lerna run tsc

# Step 4: Start/Restart the pm2 processes using the ecosystem file
echo -e "${PURPLE}[Deploy.sh]:${NC} Deploying services..."
for file in "${ecosystem_files[@]}"; do
    app_name=$(node -pe "require('$file').apps[0].name")
    if pm2 list | grep -q "$app_name"; then
        echo -e "${PURPLE}[Deploy.sh]:${NC} Restarting $app_name..."
        pm2 restart "$file"
    else
        echo -e "${PURPLE}[Deploy.sh]:${NC} Starting $app_name..."
        pm2 start "$file"
    fi
done

# Save the processes list
pm2 save

# Display PM2 process list
echo -e "${PURPLE}[Deploy.sh]:${NC} Deployment complete! Current PM2 processes:"
pm2 list
