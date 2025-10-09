#!/bin/bash

# Appwrite Setup Script for EgyGo E-commerce
# This script creates all required collections and attributes using Appwrite CLI

echo "🚀 Starting Appwrite Database Setup for EgyGo..."
echo "================================================"

# Configuration
PROJECT_ID="egygo-ecommerce"  # Change this to your project ID
DATABASE_ID="main"  # Change this to your database ID

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Appwrite CLI is installed
if ! command -v appwrite &> /dev/null; then
    echo -e "${RED}❌ Appwrite CLI is not installed!${NC}"
    echo "Install it with: npm install -g appwrite-cli"
    exit 1
fi

echo -e "${GREEN}✅ Appwrite CLI found${NC}"

# Function to create collection
create_collection() {
    local collection_id=$1
    local collection_name=$2
    
    echo -e "\n${YELLOW}Creating collection: $collection_name${NC}"
    
    appwrite databases createCollection \
        --databaseId="$DATABASE_ID" \
        --collectionId="$collection_id" \
        --name="$collection_name" \
        --permissions='["read(\"any\")","create(\"users\")","update(\"users\")","delete(\"users\")"]' \
        --documentSecurity=true
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Collection '$collection_name' created successfully${NC}"
    else
        echo -e "${RED}⚠️  Collection '$collection_name' might already exist${NC}"
    fi
}

# Function to create string attribute
create_string_attr() {
    local collection_id=$1
    local key=$2
    local size=$3
    local required=$4
    local default=$5
    
    echo "  - Adding attribute: $key (string, size: $size)"
    
    if [ -n "$default" ]; then
        appwrite databases createStringAttribute \
            --databaseId="$DATABASE_ID" \
            --collectionId="$collection_id" \
            --key="$key" \
            --size=$size \
            --required=$required \
            --default="$default"
    else
        appwrite databases createStringAttribute \
            --databaseId="$DATABASE_ID" \
            --collectionId="$collection_id" \
            --key="$key" \
            --size=$size \
            --required=$required
    fi
}

# Function to create boolean attribute
create_boolean_attr() {
    local collection_id=$1
    local key=$2
    local required=$3
    local default=$4
    
    echo "  - Adding attribute: $key (boolean)"
    
    appwrite databases createBooleanAttribute \
        --databaseId="$DATABASE_ID" \
        --collectionId="$collection_id" \
        --key="$key" \
        --required=$required \
        --default=$default
}

# Function to create integer attribute
create_integer_attr() {
    local collection_id=$1
    local key=$2
    local required=$3
    local default=$4
    local min=$5
    local max=$6
    
    echo "  - Adding attribute: $key (integer)"
    
    appwrite databases createIntegerAttribute \
        --databaseId="$DATABASE_ID" \
        --collectionId="$collection_id" \
        --key="$key" \
        --required=$required \
        --min=$min \
        --max=$max \
        --default=$default
}

# Function to create float attribute
create_float_attr() {
    local collection_id=$1
    local key=$2
    local required=$3
    local default=$4
    
    echo "  - Adding attribute: $key (float)"
    
    appwrite databases createFloatAttribute \
        --databaseId="$DATABASE_ID" \
        --collectionId="$collection_id" \
        --key="$key" \
        --required=$required \
        --default=$default
}

# Function to create datetime attribute
create_datetime_attr() {
    local collection_id=$1
    local key=$2
    local required=$3
    
    echo "  - Adding attribute: $key (datetime)"
    
    appwrite databases createDatetimeAttribute \
        --databaseId="$DATABASE_ID" \
        --collectionId="$collection_id" \
        --key="$key" \
        --required=$required
}

# Function to create enum attribute
create_enum_attr() {
    local collection_id=$1
    local key=$2
    local elements=$3
    local required=$4
    local default=$5
    
    echo "  - Adding attribute: $key (enum)"
    
    appwrite databases createEnumAttribute \
        --databaseId="$DATABASE_ID" \
        --collectionId="$collection_id" \
        --key="$key" \
        --elements="$elements" \
        --required=$required \
        --default="$default"
}

echo -e "\n${YELLOW}📦 Creating Collections...${NC}"

# ==========================================
# 1. USERS COLLECTION
# ==========================================
create_collection "users" "Users"
sleep 2

create_string_attr "users" "email" 255 true ""
sleep 1
create_string_attr "users" "name" 255 false ""
sleep 1
create_string_attr "users" "userName" 255 false ""
sleep 1
create_string_attr "users" "avatar" 2000 false ""
sleep 1
create_string_attr "users" "profileImage" 2000 false ""
sleep 1
create_enum_attr "users" "role" '["USER","ADMIN","MERCHANT","AFFILIATE"]' true "USER"
sleep 1
create_boolean_attr "users" "isActive" false true
sleep 1
create_boolean_attr "users" "isAdmin" false false
sleep 1
create_boolean_attr "users" "isAffiliate" false false
sleep 1
create_boolean_attr "users" "isMerchant" false false
sleep 1
create_string_attr "users" "phone" 50 false ""
sleep 1
create_string_attr "users" "affiliateCode" 50 false ""
sleep 1
create_float_attr "users" "commissionRate" false 15
sleep 1
create_float_attr "users" "totalEarnings" false 0
sleep 1
create_float_attr "users" "pendingEarnings" false 0
sleep 1
create_integer_attr "users" "referralCount" false 0 0 999999
sleep 1
create_datetime_attr "users" "lastActivity" false
sleep 1
create_string_attr "users" "status" 50 false "active"

echo -e "${GREEN}✅ Users collection setup complete${NC}"

# ==========================================
# 2. NOTIFICATIONS COLLECTION
# ==========================================
create_collection "notifications" "Notifications"
sleep 2

create_string_attr "notifications" "userId" 255 false ""
sleep 1
create_string_attr "notifications" "targetAudience" 50 true "all"
sleep 1
create_string_attr "notifications" "title" 500 true ""
sleep 1
create_string_attr "notifications" "message" 2000 true ""
sleep 1
create_enum_attr "notifications" "type" '["info","success","warning","error","promotion"]' true "info"
sleep 1
create_boolean_attr "notifications" "isRead" false false
sleep 1
create_datetime_attr "notifications" "readAt" false
sleep 1
create_string_attr "notifications" "link" 2000 false ""
sleep 1
create_enum_attr "notifications" "status" '["draft","sent","scheduled","failed"]' false "sent"
sleep 1
create_datetime_attr "notifications" "scheduledFor" false
sleep 1
create_datetime_attr "notifications" "sentAt" false
sleep 1
create_integer_attr "notifications" "totalRecipients" false 0 0 999999
sleep 1
create_integer_attr "notifications" "readCount" false 0 0 999999
sleep 1
create_integer_attr "notifications" "clickCount" false 0 0 999999

echo -e "${GREEN}✅ Notifications collection setup complete${NC}"

# ==========================================
# 3. NOTIFICATION TEMPLATES COLLECTION
# ==========================================
create_collection "notification_templates" "Notification Templates"
sleep 2

create_string_attr "notification_templates" "name" 255 true ""
sleep 1
create_string_attr "notification_templates" "title" 500 true ""
sleep 1
create_string_attr "notification_templates" "message" 2000 true ""
sleep 1
create_enum_attr "notification_templates" "type" '["info","success","warning","error","promotion"]' true "info"
sleep 1
create_string_attr "notification_templates" "targetAudience" 50 true "all"
sleep 1
create_boolean_attr "notification_templates" "isActive" false true
sleep 1
create_integer_attr "notification_templates" "usageCount" false 0 0 999999

echo -e "${GREEN}✅ Notification Templates collection setup complete${NC}"

# ==========================================
# 4. SCHEDULED NOTIFICATIONS COLLECTION
# ==========================================
create_collection "scheduled_notifications" "Scheduled Notifications"
sleep 2

create_string_attr "scheduled_notifications" "title" 500 true ""
sleep 1
create_string_attr "scheduled_notifications" "message" 2000 true ""
sleep 1
create_enum_attr "scheduled_notifications" "type" '["info","success","warning","error","promotion"]' true "info"
sleep 1
create_string_attr "scheduled_notifications" "targetAudience" 50 true "all"
sleep 1
create_datetime_attr "scheduled_notifications" "scheduledFor" true
sleep 1
create_enum_attr "scheduled_notifications" "status" '["scheduled","sent","cancelled"]' true "scheduled"
sleep 1
create_integer_attr "scheduled_notifications" "totalRecipients" false 0 0 999999

echo -e "${GREEN}✅ Scheduled Notifications collection setup complete${NC}"

# ==========================================
# 5. COMMISSIONS COLLECTION
# ==========================================
create_collection "commissions" "Commissions"
sleep 2

create_string_attr "commissions" "affiliateId" 255 true ""
sleep 1
create_string_attr "commissions" "orderId" 255 true ""
sleep 1
create_string_attr "commissions" "productId" 255 false ""
sleep 1
create_string_attr "commissions" "productName" 500 false ""
sleep 1
create_float_attr "commissions" "amount" true 0
sleep 1
create_float_attr "commissions" "percentage" false 15
sleep 1
create_enum_attr "commissions" "status" '["pending","approved","paid","cancelled"]' true "pending"
sleep 1
create_datetime_attr "commissions" "paidAt" false

echo -e "${GREEN}✅ Commissions collection setup complete${NC}"

# ==========================================
# 6. AFFILIATE CLICKS COLLECTION
# ==========================================
create_collection "affiliate_clicks" "Affiliate Clicks"
sleep 2

create_string_attr "affiliate_clicks" "linkId" 255 true ""
sleep 1
create_string_attr "affiliate_clicks" "affiliateId" 255 true ""
sleep 1
create_string_attr "affiliate_clicks" "productId" 255 false ""
sleep 1
create_string_attr "affiliate_clicks" "ip" 100 false ""
sleep 1
create_string_attr "affiliate_clicks" "userAgent" 1000 false ""
sleep 1
create_string_attr "affiliate_clicks" "referer" 2000 false ""
sleep 1
create_datetime_attr "affiliate_clicks" "timestamp" true

echo -e "${GREEN}✅ Affiliate Clicks collection setup complete${NC}"

# ==========================================
# 7. AFFILIATE CONVERSIONS COLLECTION
# ==========================================
create_collection "affiliate_conversions" "Affiliate Conversions"
sleep 2

create_string_attr "affiliate_conversions" "affiliateId" 255 true ""
sleep 1
create_string_attr "affiliate_conversions" "orderId" 255 true ""
sleep 1
create_string_attr "affiliate_conversions" "productId" 255 false ""
sleep 1
create_float_attr "affiliate_conversions" "amount" true 0
sleep 1
create_float_attr "affiliate_conversions" "commission" true 0
sleep 1
create_datetime_attr "affiliate_conversions" "timestamp" true

echo -e "${GREEN}✅ Affiliate Conversions collection setup complete${NC}"

# ==========================================
# 8. AFFILIATE LINKS COLLECTION
# ==========================================
create_collection "affiliate_links" "Affiliate Links"
sleep 2

create_string_attr "affiliate_links" "affiliateId" 255 true ""
sleep 1
create_string_attr "affiliate_links" "url" 2000 true ""
sleep 1
create_string_attr "affiliate_links" "productId" 255 false ""
sleep 1
create_string_attr "affiliate_links" "productName" 500 false ""
sleep 1
create_string_attr "affiliate_links" "customAlias" 100 false ""
sleep 1
create_integer_attr "affiliate_links" "clicks" false 0 0 999999
sleep 1
create_integer_attr "affiliate_links" "conversions" false 0 0 999999
sleep 1
create_float_attr "affiliate_links" "earnings" false 0
sleep 1
create_string_attr "affiliate_links" "source" 100 false ""
sleep 1
create_string_attr "affiliate_links" "campaign" 100 false ""
sleep 1
create_string_attr "affiliate_links" "shortUrl" 500 false ""
sleep 1
create_string_attr "affiliate_links" "qrCode" 2000 false ""

echo -e "${GREEN}✅ Affiliate Links collection setup complete${NC}"

# ==========================================
# 9. WITHDRAWAL REQUESTS COLLECTION
# ==========================================
create_collection "withdrawal_requests" "Withdrawal Requests"
sleep 2

create_string_attr "withdrawal_requests" "affiliateId" 255 true ""
sleep 1
create_float_attr "withdrawal_requests" "amount" true 0
sleep 1
create_enum_attr "withdrawal_requests" "method" '["bank","vodafone_cash","instapay","paypal"]' true "bank"
sleep 1
create_enum_attr "withdrawal_requests" "status" '["pending","processing","completed","rejected"]' true "pending"
sleep 1
create_string_attr "withdrawal_requests" "accountDetails" 2000 false ""
sleep 1
create_datetime_attr "withdrawal_requests" "requestedAt" true
sleep 1
create_datetime_attr "withdrawal_requests" "processedAt" false
sleep 1
create_string_attr "withdrawal_requests" "notes" 1000 false ""

echo -e "${GREEN}✅ Withdrawal Requests collection setup complete${NC}"

# ==========================================
# SUMMARY
# ==========================================
echo -e "\n${GREEN}================================================${NC}"
echo -e "${GREEN}🎉 Appwrite Database Setup Complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo -e "\n${YELLOW}Collections Created:${NC}"
echo "  1. ✅ Users"
echo "  2. ✅ Notifications"
echo "  3. ✅ Notification Templates"
echo "  4. ✅ Scheduled Notifications"
echo "  5. ✅ Commissions"
echo "  6. ✅ Affiliate Clicks"
echo "  7. ✅ Affiliate Conversions"
echo "  8. ✅ Affiliate Links"
echo "  9. ✅ Withdrawal Requests"

echo -e "\n${YELLOW}📝 Next Steps:${NC}"
echo "  1. Update your .env file with PROJECT_ID and DATABASE_ID"
echo "  2. Configure permissions for each collection in Appwrite Console"
echo "  3. Add indexes for better query performance"
echo "  4. Start adding data through your application"

echo -e "\n${GREEN}Happy Coding! 🚀${NC}\n"
