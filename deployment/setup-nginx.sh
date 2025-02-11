#!/bin/bash

# Colors for console outputs
ERROR='\033[0;31m'
SUCCESS='\033[0;32m'
INFO='\033[0;34m'
NC='\033[0m'

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
NGINX_CONF_DIR="/etc/nginx"
SITES_AVAILABLE="$NGINX_CONF_DIR/sites-available"
BACKUP_DIR="$NGINX_CONF_DIR/backup"
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
if [ -f "$SITES_AVAILABLE/default" ]; then
    cp "$SITES_AVAILABLE/default" "$BACKUP_DIR/default_$TIMESTAMP"
fi

# Copy new configuration
echo -e "${INFO}Copying new configuration...${NC}"
cp "$SCRIPT_DIR/nginx/api.conf" "$SITES_AVAILABLE/default"

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
    cp "$BACKUP_DIR/default_$TIMESTAMP" "$SITES_AVAILABLE/default"
    systemctl reload nginx
    exit 1
fi