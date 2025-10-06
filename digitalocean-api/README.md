# Vendoor API - DigitalOcean Deployment

API للتواصل مع موقع Ven-door وجلب المنتجات باستخدام Puppeteer.

## 📋 المتطلبات

- حساب DigitalOcean (مع GitHub Student Pack = $200 مجاناً)
- Ubuntu 22.04 LTS Droplet
- 2GB RAM على الأقل

## 🚀 الإعداد السريع

### 1. إنشاء Droplet

1. اذهب إلى [DigitalOcean](https://cloud.digitalocean.com)
2. Create → Droplets
3. اختر:
   - Image: Ubuntu 22.04 LTS
   - Plan: Basic $6/month
   - Datacenter: Frankfurt
4. انتظر حتى يتم إنشاء الـ Droplet

### 2. الاتصال بالسيرفر

```bash
ssh root@YOUR_SERVER_IP
```

### 3. رفع ملف الإعداد وتشغيله

```bash
# على جهازك المحلي
scp digitalocean-api/setup.sh root@YOUR_SERVER_IP:/root/

# على السيرفر
chmod +x /root/setup.sh
bash /root/setup.sh
```

### 4. رفع ملفات المشروع

```bash
# على جهازك المحلي
cd goegy-main
scp -r digitalocean-api/* root@YOUR_SERVER_IP:/var/www/vendoor-api/
```

### 5. تثبيت وتشغيل

```bash
# على السيرفر
cd /var/www/vendoor-api
pnpm install
pm2 start index.js --name vendoor-api
pm2 save
pm2 startup
```

### 6. إعداد Nginx

```bash
# إنشاء ملف التكوين
cat > /etc/nginx/sites-available/vendoor-api << 'EOF'
server {
    listen 80;
    server_name YOUR_SERVER_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # زيادة Timeout للـ scraping
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
EOF

# تفعيل الموقع
ln -s /etc/nginx/sites-available/vendoor-api /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
systemctl restart nginx
```

## 🧪 الاختبار

```bash
# Health check
curl http://YOUR_SERVER_IP/health

# جلب صفحة واحدة
curl http://YOUR_SERVER_IP/scrape-page?page=1

# جلب جميع المنتجات (سيأخذ بضع دقائق)
curl http://YOUR_SERVER_IP/scrape-all
```

## 📡 API Endpoints

### GET /health
Health check للتأكد أن API يعمل

**Response:**
```json
{
  "status": "ok",
  "message": "Vendoor API is running",
  "timestamp": "2025-10-05T12:00:00.000Z"
}
```

### GET /scrape-all
جلب جميع المنتجات من كل الصفحات (41 صفحة)

**Response:**
```json
{
  "success": true,
  "totalProducts": 615,
  "totalPages": 41,
  "products": [...],
  "timestamp": "2025-10-05T12:00:00.000Z"
}
```

### GET /scrape-page?page=1
جلب منتجات صفحة واحدة

**Parameters:**
- `page` (number): رقم الصفحة (1-41)

**Response:**
```json
{
  "success": true,
  "page": 1,
  "totalProducts": 15,
  "products": [...],
  "timestamp": "2025-10-05T12:00:00.000Z"
}
```

## 🔧 إدارة التطبيق

```bash
# مشاهدة الحالة
pm2 status

# مشاهدة logs
pm2 logs vendoor-api

# إعادة التشغيل
pm2 restart vendoor-api

# إيقاف
pm2 stop vendoor-api

# حذف
pm2 delete vendoor-api
```

## 🔒 المتغيرات البيئية (اختياري)

```bash
# إنشاء ملف .env
cat > /var/www/vendoor-api/.env << 'EOF'
PORT=3000
VENDOOR_EMAIL=almlmibrahym574@gmail.com
VENDOOR_PASSWORD=hema2004
NODE_ENV=production
EOF

# إعادة تشغيل التطبيق
pm2 restart vendoor-api --update-env
```

## 🛡️ إعداد Firewall

```bash
# السماح بـ HTTP و HTTPS و SSH
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

## 📊 المراقبة

```bash
# تثبيت PM2 monitoring (اختياري)
pm2 install pm2-logrotate

# عرض dashboard
pm2 monit
```

## 🔄 التحديثات

```bash
# سحب آخر التحديثات
cd /var/www/vendoor-api
git pull  # إذا كنت تستخدم Git

# أو نسخ الملفات مباشرة
scp -r digitalocean-api/* root@YOUR_SERVER_IP:/var/www/vendoor-api/

# تثبيت المكتبات الجديدة
pnpm install

# إعادة التشغيل
pm2 restart vendoor-api
```

## ⚠️ استكشاف الأخطاء

### خطأ: "chromium-browser not found"

```bash
# تثبيت Chromium
apt install -y chromium-browser

# أو تحديد المسار في .env
echo 'PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium' >> .env
pm2 restart vendoor-api --update-env
```

### خطأ: "Memory exceeded"

```bash
# زيادة swap memory
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### خطأ: "Timeout"

الـ scraping يأخذ وقت طويل (5-10 دقائق للـ 41 صفحة). تأكد من:
1. إعدادات Nginx timeout صحيحة (300s)
2. السيرفر لديه RAM كافي (2GB+)
3. الاتصال بالإنترنت مستقر

## 💰 التكاليف

مع GitHub Student Pack:
- **$200 رصيد مجاني**
- Droplet $6/شهر = **33 شهر مجاناً!**

## 📞 الدعم

راجع `GITHUB_STUDENT_SOLUTIONS.md` للتفاصيل الكاملة.
