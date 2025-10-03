# Manual Redeploy Instructions

الـ CORS fix موجود في الكود لكن محتاج redeploy. اتبع الخطوات دي:

## Option 1: Redeploy من Appwrite Console (الأسرع)

1. **افتح Appwrite Console**: https://cloud.appwrite.io/console/project-68d8b9db00134c41e7c8/functions/function-6707c6bb000be46c5eae

2. **روح Deployments tab**

3. **اضغط على آخر deployment** (اللي عليه status "Ready")

4. **اضغط "Redeploy"** من القائمة

5. **انتظر 2-3 دقائق** حتى يكتمل الـ build

6. **جرب AI Assistant تاني**

## Option 2: Create New Deployment

1. في الـ Function page، اضغط **"Create deployment"**

2. اختر **"Git"** 

3. اختر Branch: **main**

4. اضغط **"Create"**

5. انتظر الـ build يخلص

## Option 3: Force Rebuild via Dummy Commit

إذا الـ auto-deploy مش شغال، عمل dummy commit:

```bash
# في Terminal
cd functions/openai-chat
echo "# Force rebuild" >> README.md
git add .
git commit -m "🔄 Force Function redeploy"
git push origin main
```

## تأكد من Environment Variables

قبل ما تجرب، تأكد إن:
- `OPENAI_API_KEY` موجود في Function Settings → Variables
- الـ value صحيح (بدون spaces زيادة)

## Current Function URL:
```
https://68dfe4d400329f850dbd.fra.appwrite.run/
```

الـ CORS headers موجودة في الكود دلوقتي، بس محتاجة redeploy علشان تشتغل!
