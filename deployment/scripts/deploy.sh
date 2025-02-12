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

installNodeJs(){
  # Check if npm is installed, if not install it
  if ! command -v npm &> /dev/null; then
    echo -e "${PURPLE}[Deploy.sh]:${NC} ${WARNING}NodeJs is not installed. Installing NodeJs 18.x${NC}"
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm use 18 || nvm install 18
  else
    echo -e "${PURPLE}[Deploy.sh]:${NC} ${SUCCESS}NodeJs already installed.${NC}"
  fi
}

installPm2(){
  # Check if package.json exists
  if [[ ! -f "package.json" ]]; then
    echo -e "${PURPLE}[Deploy.sh]:${NC} package.json does not exist. Skipping pm2 install..."
    return
  fi

  installNodeJs

  # Check if PM2 is installed, if not install it
  if ! command -v pm2 &> /dev/null; then
    echo -e "${PURPLE}[Deploy.sh]:${NC} PM2 is not installed. Installing PM2..."
    npm install pm2@latest -g || { echo -e "${PURPLE}[Deploy.sh]:${NC} Failed to install PM2"; exit 1; }
    
    # Run PM2 startup command with current username
    CURRENT_USER=$(whoami)
    echo -e "${PURPLE}[Deploy.sh]:${NC} Setting up PM2 to run on startup..."
    sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u "$CURRENT_USER" --hp /home/"$CURRENT_USER"
  else
    echo -e "${PURPLE}[Deploy.sh]:${NC} pm2 already installed..."
  fi
}

installPm2

# Step 1: Ensure necessary commands are available
echo -e "${PURPLE}[Deploy.sh]:${NC} Checking required dependencies..."
for cmd in git node pm2 npx; do
    if ! command -v "$cmd" &> /dev/null; then
        echo -e "${ERROR}[Deploy.sh]: Error - Required command '$cmd' not found!${NC}"
        exit 1
    fi
done

cd "$DEPLOY_DIR"

if [ -f "package.json" ]; then
    npm install
    npm install -ws
    npm run build
else
    echo "Error: package.json not found"
    exit 1
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
export NODE_OPTIONS="--max-old-space-size=4096"
if ! timeout 300 npx lerna run tsc --concurrency 1 --no-bail; then
    echo -e "${ERROR}[Deploy.sh]: Build failed or timed out after 5 minutes${NC}"
    echo -e "${WARNING}[Deploy.sh]: Checking individual service build status...${NC}"
    for service in ./services/*; do
        if [ -d "$service" ]; then
            echo -e "${PURPLE}[Deploy.sh]:${NC} Building $(basename $service)..."
            cd "$service" && npx tsc || true
            cd - > /dev/null
        fi
    done
fi

# Add these functions before the service loop
setupEnvironment() {
    echo -e "${PURPLE}[Deploy.sh]:${NC} Setting up environment..."
    export PM2_HOME=/home/deploy/.pm2
    set -a
    source ~/.env
    set +a
}

cleanup() {
    echo -e "${PURPLE}[Deploy.sh]:${NC} Cleaning up old processes..."
    pm2 delete all || true
    rm -rf ~/.pm2/dump.pm2 || true
}

# Call these once before the service loop
setupEnvironment
cleanup

# Step 5: Start/Restart the pm2 processes using the ecosystem files
echo -e "${PURPLE}[Deploy.sh]:${NC} Deploying services..."
for file in "${ecosystem_files[@]}"; do
    app_name=$(node -pe "require('$file').apps[0].name" 2>/dev/null || echo "Unknown App")
    if [[ "$app_name" == "Unknown App" ]]; then
        echo -e "${ERROR}[Deploy.sh]: Skipping invalid ecosystem file: $file${NC}"
        continue
    fi

    # Extract directory from the file path
    file_dir=$(dirname "$file")
    file_name=$(basename "$file")

    # Navigate to the file's directory
    cd "$file_dir" || { echo -e "${ERROR}[Deploy.sh]: Failed to change directory to $file_dir${NC}"; exit 1; }

    # Check if the app is already running
    # Add environment setup function
    setupEnvironment() {
        echo -e "${PURPLE}[Deploy.sh]:${NC} Setting up environment..."
        # Ensure PM2_HOME is set
        export PM2_HOME=/home/deploy/.pm2
        
        # Load environment variables
        set -a
        source ~/.env
        set +a
    }
    
    # Add cleanup function
    cleanup() {
        echo -e "${PURPLE}[Deploy.sh]:${NC} Cleaning up old processes..."
        pm2 delete all || true
        rm -rf ~/.pm2/dump.pm2 || true
    }
    
    # Add these lines after installPm2
    setupEnvironment
    
    # Add before finding ecosystem files
    cleanup
    
    # Modify the PM2 start/restart section
        if pm2 describe "$app_name" >/dev/null 2>&1; then
            echo -e "${PURPLE}[Deploy.sh]:${NC} Restarting $app_name..."
            pm2 delete "$app_name" || true
            PM2_AWSREGION_PRODUCTION="$AWSREGION_PRODUCTION" PM2_CLIENT_SECRET="$CLIENT_SECRET" \
            pm2 start "$file_name" --name "$app_name" --update-env || {
                echo -e "${ERROR}[Deploy.sh]: Failed to restart $app_name${NC}"
                exit 1
            }
        else
            echo -e "${PURPLE}[Deploy.sh]:${NC} Starting $app_name..."
            PM2_AWSREGION_PRODUCTION="$AWSREGION_PRODUCTION" PM2_CLIENT_SECRET="$CLIENT_SECRET" \
            pm2 start "$file_name" --name "$app_name" --update-env || {
                echo -e "${ERROR}[Deploy.sh]: Failed to start $app_name${NC}"
                exit 1
            }
        fi
    
    # Add after saving PM2 process list
    echo -e "${PURPLE}[Deploy.sh]:${NC} Setting up PM2 startup script..."
    pm2 startup systemd -u deploy --hp /home/deploy || true
    sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u deploy --hp /home/deploy || true
done

# Save the processes list
echo -e "${PURPLE}[Deploy.sh]:${NC} Saving PM2 process list..."
if ! pm2 save; then
    echo -e "${ERROR}[Deploy.sh]: Failed to save PM2 process list!${NC}"
fi

# Display PM2 process list
echo -e "${PURPLE}[Deploy.sh]:${NC} Deployment complete! Current PM2 processes:"
pm2 list
