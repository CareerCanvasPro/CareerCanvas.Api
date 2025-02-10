#!/bin/bash

# Colors for console outputs
ERROR='\033[0;31m'
WARNING='\033[1;33m'
SUCCESS='\033[0;32m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Enable exit on error and catch errors
set -eE

# Error handler function
error_handler() {
    echo -e "${ERROR}[Deploy.sh]: An error occurred on line $1.${NC}"
    exit 1
}
trap 'error_handler $LINENO' ERR

# Step 1: Ensure necessary commands are available
echo -e "${PURPLE}[Deploy.sh]:${NC} Checking required dependencies..."
for cmd in git node pm2 npx; do
    if ! command -v "$cmd" &> /dev/null; then
        echo -e "${ERROR}[Deploy.sh]: Error - Required command '$cmd' not found!${NC}"
        exit 1
    fi
done

# Step 2: Pull the latest code from the repository
echo -e "${PURPLE}[Deploy.sh]:${NC} Pulling latest code..."
if ! git pull origin "$(git rev-parse --abbrev-ref HEAD)"; then
    echo -e "${ERROR}[Deploy.sh]: Git pull failed!${NC}"
fi

# Step 3: Find all ecosystem.config.js files in subdirectories of ./services/
echo -e "${PURPLE}[Deploy.sh]:${NC} Searching for ecosystem.config.js files..."
mapfile -t ecosystem_files < <(find ./services -mindepth 2 -type f -name "ecosystem.config.js")

if [[ ${#ecosystem_files[@]} -eq 0 ]]; then
    echo -e "${ERROR}[Deploy.sh]: No ecosystem.config.js files found!${NC}"
    exit 1
fi

# Add environment variables check
echo -e "${PURPLE}[Deploy.sh]:${NC} Checking environment variables..."
if [ -z "$AWSREGION_PRODUCTION" ] || [ -z "$CLIENT_SECRET" ]; then
    echo -e "${ERROR}[Deploy.sh]: Required environment variables not set!${NC}"
    exit 1
fi

# Print ecosystem files found in the project
echo -e "${PURPLE}[Deploy.sh]:${NC} Found ${#ecosystem_files[@]} ecosystem files:"
rows=()
for file in "${ecosystem_files[@]}"; do
    app_name=$(node -pe "require('$file').apps[0].name" 2>/dev/null || echo "Unknown App")
    if [[ "$app_name" == "Unknown App" ]]; then
        echo -e "${ERROR}[Deploy.sh]: Failed to extract app name from $file${NC}"
        continue
    fi
    rows+=("$app_name | : $file")
done
printf "%s\n" "${rows[@]}" | column -t -s '|'
echo ""

# Step 4: Build the project using Lerna with increased timeout
echo -e "${PURPLE}[Deploy.sh]:${NC} Building project using Lerna..."
if ! NODE_OPTIONS="--max-old-space-size=4096" npx lerna run tsc --concurrency 1; then
    echo -e "${ERROR}[Deploy.sh]: Build failed!${NC}"
    exit 1
fi

# Step 5: Start/Restart the pm2 processes using the ecosystem files
echo -e "${PURPLE}[Deploy.sh]:${NC} Deploying services..."
for file in "${ecosystem_files[@]}"; do
    app_name=$(node -pe "require('$file').apps[0].name" 2>/dev/null || echo "Unknown App")
    if [[ "$app_name" == "Unknown App" ]]; then
        echo -e "${ERROR}[Deploy.sh]: Skipping invalid ecosystem file: $file${NC}"
        continue
    fi

    # Pass environment variables to PM2
    if pm2 list | grep -q "$app_name"; then
        echo -e "${PURPLE}[Deploy.sh]:${NC} Restarting $app_name..."
        AWSREGION_PRODUCTION="$AWSREGION_PRODUCTION" CLIENT_SECRET="$CLIENT_SECRET" pm2 restart "$file" || {
            echo -e "${ERROR}[Deploy.sh]: Failed to restart $app_name${NC}"
        }
    else
        echo -e "${PURPLE}[Deploy.sh]:${NC} Starting $app_name..."
        AWSREGION_PRODUCTION="$AWSREGION_PRODUCTION" CLIENT_SECRET="$CLIENT_SECRET" pm2 start "$file" || {
            echo -e "${ERROR}[Deploy.sh]: Failed to start $app_name${NC}"
        }
    fi
done

# Save the processes list
echo -e "${PURPLE}[Deploy.sh]:${NC} Saving PM2 process list..."
if ! pm2 save; then
    echo -e "${ERROR}[Deploy.sh]: Failed to save PM2 process list!${NC}"
fi

# Display PM2 process list
echo -e "${PURPLE}[Deploy.sh]:${NC} Deployment complete! Current PM2 processes:"
pm2 list
