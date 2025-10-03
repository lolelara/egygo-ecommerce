# Appwrite Function Deployment Guide

## Function Configuration

### Basic Settings:
- **Name**: `OpenAI Chat API`
- **Function ID**: `openai-chat`
- **Runtime**: `Node.js 18.0` (node-18.0)
- **Entrypoint**: `src/main.js`

### Build Settings:
- **Root Directory**: `functions/openai-chat`
- **Build Command**: `npm install`

### Execute Access:
- **Execute Permissions**: `Any` (للسماح لأي مستخدم باستخدام الـ Function)

### Environment Variables:
Add this environment variable in the Function settings:
```
Key: OPENAI_API_KEY
Value: [استخدم الـ OpenAI API Key من ملف .env المحلي]
```

### Deployment:
- **Branch**: `main` (Production branch)
- **Silent Mode**: ✅ (اختياري - لو مش عايز comments في GitHub)

## خطوات النشر:

### طريقة 1: من خلال Appwrite Console (الأسهل)

1. **افتح Appwrite Console**: https://cloud.appwrite.io/console/project-68d8b9db00134c41e7c8

2. **روح Functions**:
   - من القائمة الجانبية اختر `Functions`
   - اضغط `Create function`

3. **اختر Deployment Method**:
   - اختر `Connect Git repository`
   - اختار repo: `lolelara/egygo-ecommerce`
   - Branch: `main`

4. **Function Settings**:
   - Name: `OpenAI Chat API`
   - Function ID: `openai-chat`
   - Runtime: `Node.js 18.0`
   - Root directory: `functions/openai-chat`
   - Entrypoint: `src/main.js`
   - Build command: `npm install`

5. **Execute Permissions**:
   - اختر `Any` علشان أي حد يقدر يستخدم الـ Function

6. **Environment Variables**:
   - اضغط `Add variable`
   - Key: `OPENAI_API_KEY`
   - Value: [الـ OpenAI API Key من ملف .env]

7. **Deploy**:
   - اضغط `Create` أو `Deploy`
   - انتظر حتى يتم الـ build والـ deployment

### طريقة 2: من خلال CLI (إذا كنت مسجل دخول)

```bash
# Login to Appwrite CLI (لو مش مسجل دخول)
appwrite login

# Push the function
appwrite push function openai-chat

# Set environment variable
appwrite functions updateVariable \
  --functionId openai-chat \
  --key OPENAI_API_KEY \
  --value "your-openai-api-key-here"
```

## ملفات الـ Function الجاهزة:

الملفات دي موجودة وجاهزة للنشر:
- ✅ `functions/openai-chat/src/main.js` - الكود الرئيسي
- ✅ `functions/openai-chat/package.json` - Dependencies
- ✅ `functions/openai-chat/.appwrite.json` - Function config
- ✅ `appwrite.json` - تم تحديثه بمعلومات الـ Function

## بعد النشر:

1. **احصل على Function ID** من Appwrite Console
2. **تأكد من Environment Variable** موجودة (`OPENAI_API_KEY`)
3. **Test the Function** من خلال Console أو من خلال الموقع

## Function Endpoint:

بعد النشر، الـ Function هيكون متاح على:
```
https://fra.cloud.appwrite.io/v1/functions/openai-chat/executions
```

الكود في `AIAssistant.tsx` جاهز ومعدّل للاستخدام مع Appwrite Functions! 🎉
