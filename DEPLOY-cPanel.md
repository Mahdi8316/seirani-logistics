# راهنمای انتشار روی cPanel با «Application Manager»

چون cPanel شما «Setup Node.js App» ندارد، اپ Node را از طریق **Application Manager**
(که با Phusion Passenger کار می‌کند) اجرا می‌کنیم.

---

## ⚠️ اول این سه چیز را با هاست چک کن (قبل از هر کاری)

این مسیر فقط وقتی جواب می‌دهد که هاستت Node را پشتیبانی کند. از **پشتیبانی هاست**
بپرس یا خودت در **Terminal** cPanel چک کن:

1. **آیا Node.js از طریق Application Manager/Passenger پشتیبانی می‌شود؟**
   (بدون این، این روش کار نمی‌کند.)

2. **نسخه‌ی Node چند است؟** در Terminal بزن:
   ```bash
   node -v
   ```
   - اگر **۲۲٫۵ یا بالاتر** بود → عالی، ادامه بده.
   - اگر **کمتر از ۲۲٫۵** بود (مثلاً ۱۸ یا ۲۰) → دیتابیس فعلی (`node:sqlite`) کار
     نمی‌کند. **به من بگو** تا ذخیره‌سازی را به روشی عوض کنم که روی هر نسخه‌ی Node
     اجرا شود (بدون هیچ نصب اضافه).

3. **آیا Terminal یا SSH داری؟** برای `npm install` و `npm run build` لازم است.

اگر هاست اصلاً Node نداشت، این روش ممکن نیست؛ آن‌وقت گزینه‌ی «هاست Node جدا» یا
«نسخه‌ی استاتیک» را با هم بررسی می‌کنیم.

---

## گام‌به‌گام

### ۱) آپلود فایل‌ها
کل پروژه را در یک پوشه‌ی داخل هوم آپلود کن — مثلاً `~/seirani`. این‌ها را آپلود **نکن**
(روی سرور ساخته می‌شوند): `node_modules`، `.next`، `data/`، `.env*`.

### ۲) نصب پکیج‌ها و ساخت (در Terminal)
در Terminal cPanel:
```bash
cd ~/seirani
node -v            # مطمئن شو ۲۲٫۵ به بالاست
npm install
npm run build
```
> اگر `npm install` به‌خاطر production بودن، پکیج‌های ساخت را رد کرد، این را بزن:
> `npm install --production=false` سپس دوباره `npm run build`.
> (در این پروژه TypeScript داخل dependencies گذاشته شده تا این مشکل پیش نیاید.)

### ۳) ساخت فایل `.env` برای مقادیر محرمانه
یک فایل `.env` کنار پروژه بساز (یا از طریق Environment variables در Application
Manager تنظیمشان کن):
```
NEXT_PUBLIC_SITE_URL=https://your-domain
ADMIN_USERNAME=admin
ADMIN_PASSWORD=یک-رمز-قوی
ADMIN_SESSION_SECRET=یک-رشته-تصادفی-طولانی
```
ساخت کلید تصادفی:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```
> اگر سایتت SSL ندارد و لاگین کار نکرد، `COOKIE_SECURE=false` را هم اضافه کن.

### ۴) ثبت اپ در Application Manager
cPanel → **Application Manager** → **Register Application**:
- **Name:** یک نام دلخواه (مثلاً seirani)
- **Path / Application root:** مسیر پوشه نسبت به هوم (مثلاً `seirani`)
- **Domain:** دامنه یا زیردامنه‌ی موردنظر
- **Base application URL:** معمولاً `/`
- **Deployment environment:** Production
- **Startup file:** اگر پرسید، `app.js` (فایل ورودی همین است)
- **Environment variables:** اگر `.env` نساختی، همان‌ها را این‌جا اضافه کن.

سپس **Deploy/Save** و بعد **Restart**.

### ۵) بررسی
- سایت: `https://your-domain`
- پنل مدیریت: `https://your-domain/admin` (ورود با `ADMIN_USERNAME`/`ADMIN_PASSWORD`)

در نخستین اجرا، دیتابیس `data/seirani.db` خودکار ساخته و پر می‌شود.

---

## به‌روزرسانی بعدی
```bash
cd ~/seirani
npm install        # اگر پکیجی اضافه شده
npm run build
```
سپس در Application Manager اپ را **Restart** کن. فایل `data/seirani.db`
(محتوایی که در پنل ساخته‌ای) دست‌نخورده می‌ماند.

## نکات
- **دیتابیس:** `data/seirani.db` — برای پشتیبان‌گیری همین فایل را نگه دار.
- **صفر کردن محتوا:** فایل‌های `data/seirani.db*` را حذف و Restart کن.
- **آیکون خدمات** داخل دیتابیس ذخیره می‌شود (نیازی به پوشه‌ی آپلود نیست).
- اگر Passenger فایل ورودی دیگری خواست، `app.js` را معرفی کن (یا `server.js` که همان
  را صدا می‌زند).
