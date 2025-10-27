#!/bin/bash

echo "🚀 Deploying Vendoor Scraper V2 to Appwrite..."
echo ""

# Check if appwrite CLI is installed
if ! command -v appwrite &> /dev/null; then
    echo "❌ Appwrite CLI not found. Installing..."
    npm install -g appwrite-cli
fi

# Check if logged in
echo "✅ Checking Appwrite login..."
appwrite client --version || appwrite login

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Deploy function
echo ""
echo "🚀 Deploying function..."
appwrite deploy function

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Next steps:"
echo "1. Check Appwrite Console: https://cloud.appwrite.io"
echo "2. Test the function in Executions tab"
echo "3. Monitor logs for any errors"
echo ""
echo "🎉 Done!"
