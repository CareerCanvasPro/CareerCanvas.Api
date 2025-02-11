#!/bin/bash

# Colors for console outputs
ERROR='\033[0;31m'
SUCCESS='\033[0;32m'
INFO='\033[0;34m'
NC='\033[0m'

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
NGINX_CONF_DIR="/etc/nginx"
SITES_AVAILABLE="$NGINX_CONF_DIR/sites-available"
SITES_ENABLED="$NGINX_CONF_DIR/sites-enabled"
BACKUP_DIR="$NGINX_CONF_DIR/backup"
DEPLOYMENT_CONF_DIR="$PROJECT_ROOT/deployment/nginx"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Error handling
set -eE
trap 'echo -e "${ERROR}Error occurred on line $LINENO${NC}"' ERR

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${ERROR}Please run as root or with sudo${NC}"
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup existing configuration
echo -e "${INFO}Backing up current configuration...${NC}"
for file in "$SITES_AVAILABLE"/*; do
    [ -f "$file" ] && cp "$file" "$BACKUP_DIR/$(basename "$file")_$TIMESTAMP"
done

# Copy new configuration files
echo -e "${INFO}Copying new configuration files...${NC}"
cp "$DEPLOYMENT_CONF_DIR"/* "$SITES_AVAILABLE/"

# Ensure symlinks exist in sites-enabled
echo -e "${INFO}Ensuring configurations are enabled...${NC}"
for file in "$SITES_AVAILABLE"/*; do
    ln -sf "$file" "$SITES_ENABLED/$(basename "$file")"
done

# Test configuration
echo -e "${INFO}Testing Nginx configuration...${NC}"
if nginx -t; then
    echo -e "${SUCCESS}Configuration test passed${NC}"
    echo -e "${INFO}Reloading Nginx...${NC}"
    systemctl reload nginx
    echo -e "${SUCCESS}Nginx configuration updated successfully${NC}"
else
    echo -e "${ERROR}Configuration test failed${NC}"
    echo -e "${INFO}Rolling back to previous configuration...${NC}"
    for file in "$BACKUP_DIR"/*_"$TIMESTAMP"; do
        [ -f "$file" ] && cp "$file" "$SITES_AVAILABLE/$(basename "$file" | sed "s/_$TIMESTAMP//")"
    done
    systemctl reload nginx
    exit 1
fi
