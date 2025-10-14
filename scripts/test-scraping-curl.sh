#!/bin/bash

# ========================================
# اختبار Vendoor Scraping بـ cURL
# ========================================

FUNCTION_URL="https://68e1f6240030405882c5.fra.appwrite.run"
EMAIL="almlmibrahym574@gmail.com"
PASSWORD="hema2004"

echo "🧪 اختبار Vendoor Scraping..."
echo ""

# 1. Health Check
echo "1️⃣ Health Check..."
curl -X POST "$FUNCTION_URL" \
  -H "Content-Type: application/json" \
  -d '{"action":"health"}' \
  | jq '.'
echo ""
echo "---"
echo ""

# 2. جلب منتج واحد
echo "2️⃣ جلب منتج واحد (4259)..."
curl -X POST "$FUNCTION_URL" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"scrape-single\",\"productId\":\"4259\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  | jq '.'
echo ""
echo "---"
echo ""

# 3. جلب صفحة واحدة
echo "3️⃣ جلب الصفحة 1..."
curl -X POST "$FUNCTION_URL" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"scrape-page\",\"page\":1,\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  | jq '.'
echo ""
echo "---"
echo ""

echo "✅ الاختبار مكتمل!"
