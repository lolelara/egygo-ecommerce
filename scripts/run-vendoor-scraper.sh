#!/bin/bash

# Run Vendoor Scraper Script
# Usage: ./run-vendoor-scraper.sh [debug]

echo "🚀 Starting Vendoor Scraper..."
echo "================================"

# Check if debug mode is requested
if [ "$1" = "debug" ]; then
    echo "📝 Running in DEBUG mode..."
    export DEBUG_SCRAPER=1
fi

# Navigate to scraper directory
cd ~/vendoor-scraper

# Check if the script exists
if [ ! -f "vendoor-scraper-with-live-updates.mjs" ]; then
    echo "❌ Error: vendoor-scraper-with-live-updates.mjs not found!"
    echo "   Please upload the script first using:"
    echo "   scp scripts/vendoor-scraper-with-live-updates.mjs azureuser@20.208.131.121:~/vendoor-scraper/"
    exit 1
fi

# Run the scraper
echo "📦 Running scraper..."
echo ""
node vendoor-scraper-with-live-updates.mjs

echo ""
echo "✅ Scraper finished!"
