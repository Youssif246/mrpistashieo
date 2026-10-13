# دليل نشر موقع مستر بيستاشيو على هوستنجر بريميوم (Hostinger Deployment Manual)
## Mister Pistachio | Static Hosting via `public_html` (Apache)

---

### 1. نظرة عامة على معمارية النشر (Deployment Architecture)

تم ضبط موقع **مستر بيستاشيو (Mister Pistachio)** المبني على Angular 21 ليعمل كـ **موقع ثابت فائق السرعة ومسبق التصيير (100% Prerendered Static Site)** متوافق بالكامل مع خطط الاستضافة المشتركة **Hostinger Premium Web Hosting**.

- **لا يتطلب خادم Node.js أو Express قيد التشغيل على الاستضافة**.
- يتم تصيير جميع الصفحات (الرئيسية، الصفحات الفرعية، والمقالات العربية والإنجليزية) إلى ملفات HTML حقيقية ومستقلة أثناء عملية البناء المحلية (`ng build`).
- يتكفل خادم الويب Apache في هوستنجر عبر ملف `.htaccess` بتوجيه الروابط، إجبار بروتوكول HTTPS، التعامل مع صفحات 404، وضغط الملفات والتخزين المؤقت.

---

### 2. أمر البناء الإنتاجي (Production Build Command)

في بيئة العمل المحلية (Local Terminal)، شغّل الأمر التالي:

```bash
npm run build
```

يقوم هذا الأمر تلقائياً بتنفيذ خطوتين متكاملتين:
1. **`ng build`**: بناء تطبيق Angular 21 وتصيير جميع المسارات الـ 29 (Static Prerender) إلى ملفات HTML وCSS وJS.
2. **`node scripts/post-build.mjs`**: تشغيل سكربت ما بعد البناء الذي يقوم بـ:
   - توليد ملف `dist/project/browser/index.html` للتحويل الفوري إلى النسخة العربية `/ar/` مع وسوم SEO الكاملة.
   - نسخ ملف الخطأ `404/index.html` إلى `dist/project/browser/404.html` لدعم توجيهات Apache ErrorDocument.
   - فحص ملفات المقالات (`ar.json` و`en.json`) وتوليد خريطة الموقع الإنتاجية المحدثة `sitemap.xml` متضمنة وسوم `xhtml:link` للغات البديلة وتواريخ التحديث.
   - نسخ ملف التكوين `.htaccess` وملف `robots.txt` إلى مجلد النشر النهائي.

---

### 3. مجلد المخرجات ومحتويات الرفع (Output Directory & Upload Assets)

- **المسار الدقيق لمجلد المخرجات على جهازك**:
  ```text
  dist/project/browser/
  ```

- **المحتويات التي يجب رفعها إلى استضافة هوستنجر (داخل `public_html`)**:
  ```text
  dist/project/browser/
  ├── ar/                          <-- صفحات الموقع العربي المصيرة مسبقاً
  │   ├── index.html
  │   ├── about/index.html
  │   ├── services/index.html
  │   ├── varieties/index.html
  │   ├── ucb1/index.html
  │   ├── articles/index.html
  │   ├── articles/.../index.html  <-- جميع المقالات العربية
  │   └── contact/index.html
  ├── en/                          <-- صفحات الموقع الإنجليزي المصيرة مسبقاً
  │   ├── index.html
  │   ├── about/index.html
  │   ├── services/index.html
  │   ├── varieties/index.html
  │   ├── ucb1/index.html
  │   ├── articles/index.html
  │   ├── articles/.../index.html  <-- جميع المقالات الإنجليزية
  │   └── contact/index.html
  ├── 404/                         <-- صفحة 404 كمجلد
  ├── 404.html                     <-- ملف صفحة 404 المباشر
  ├── index.html                   <-- صفحة الجذر المحولة تلقائياً إلى /ar/
  ├── .htaccess                    <-- تكوين Apache الشامل لهوستنجر
  ├── robots.txt                   <-- ملف توجيه عناكب البحث
  ├── sitemap.xml                  <-- خريطة الموقع المحدثة
  ├── assets/                      <-- الصور والبيانات وبيانات المقالات
  ├── home-images/                 <-- صور الأبطال والخلفيات
  └── *.js, *.css, *.webp...       <-- حزم الجافاسكربت والأنماط والأيقونات
  ```

> **تنبيه هام جداً**: يتم رفع **محتويات** مجلد `browser` مباشرة داخل `public_html` وليس مجلد `browser` نفسه، بحيث يكون ملف `index.html` وملف `.htaccess` مباشرة تحت `public_html/`.

---

### 4. خطوات الرفع عبر مدير ملفات هوستنجر (Hostinger File Manager Steps)

1. **ضغط الملفات محلياً**:
   - ادخل إلى المجلد `dist/project/browser/`.
   - حدد كافة الملفات والمجلدات بداخله (بما فيها ملف `.htaccess` وملف `robots.txt`).
   - اضغط عليها بالزر الأيمن واختر ضغط كملف ZIP (مثلاً: `deploy.zip`).

2. **تسجيل الدخول إلى هوستنجر**:
   - افتح لوحة تحكم هوستنجر (hPanel).
   - انتقل إلى **Websites** ثم اختر موقعك واضغط **Manage**.
   - اختر **File Manager** (مدير الملفات) وافتح المجلد **`public_html`**.

3. **تنظيف المجلد ورفع الملف**:
   - إذا كان هناك ملفات سابقة أو ملف `default.php` الترحيبي لهوستنجر، قم بحذفها بعد أخذ نسخة احتياطية إن لزم الأمر.
   - اضغط على أيقونة **Upload** (رفع) في أعلى مدير الملفات واختر `deploy.zip`.

4. **فك الضغط (Extract)**:
   - بعد اكتمال الرفع، اضغط بالزر الأيمن على `deploy.zip` واختر **Extract**.
   - تأكد من استخراج الملفات مباشرة داخل المسار الحالي (`/public_html`).
   - بعد انتهاء الاستخراج، يمكنك حذف ملف `deploy.zip` لتوفير المساحة.

5. **التحقق من ملف `.htaccess`**:
   - تأكد من ظهور ملف `.htaccess` في قائمة الملفات. (إذا كان مخفياً، فعّل خيار *Show Hidden Files* في إعدادات مدير الملفات).

---

### 5. ملف إعدادات الخادم (`.htaccess`)

ملف `.htaccess` تم إنشاؤه مسبقاً وتضمينه في مجلد `public/` ويتم نقله تلقائياً إلى حزمة النشر. يحتوي على القواعد الأساسية التالية:

```apache
# 1. تفعيل محرك إعادة التوجيه
RewriteEngine On
RewriteBase /

# 2. إجبار بروتوكول HTTPS المشفر
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# 3. تحويل الرابط الجذري (/) إلى النسخة العربية الافتراضية (/ar/)
RewriteRule ^$ /ar/ [R=301,L]

# 4. ضبط علامة السلاش في نهايات روابط اللغات الأساسية
RewriteRule ^ar$ /ar/ [R=301,L]
RewriteRule ^en$ /en/ [R=301,L]

# 5. الحفاظ على الروابط القديمة والمعدلة (Legacy Redirects)
RewriteRule ^ar/products/?$ /ar/varieties/ [R=301,L]
RewriteRule ^en/products/?$ /en/varieties/ [R=301,L]
RewriteRule ^ar/usb1/?$ /ar/ucb1/ [R=301,L]
RewriteRule ^en/usb1/?$ /en/ucb1/ [R=301,L]
RewriteRule ^ar/rootstock-ucb1/?$ /ar/ucb1/ [R=301,L]
RewriteRule ^en/rootstock-ucb1/?$ /en/ucb1/ [R=301,L]

# 6. خدمة الملفات والمجلدات الثابتة المصيرة تلقائياً
DirectoryIndex index.html
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# 7. التوجيه الاحتياطي للغات (Client-side Hydration Fallback)
RewriteCond %{REQUEST_URI} ^/ar/
RewriteCond %{DOCUMENT_ROOT}/ar/index.html -f
RewriteRule ^ar/.*$ /ar/index.html [L]

RewriteCond %{REQUEST_URI} ^/en/
RewriteCond %{DOCUMENT_ROOT}/en/index.html -f
RewriteRule ^en/.*$ /en/index.html [L]

# 8. إدارة صفحات الخطأ الحقيقية (Real 404 HTTP Status)
ErrorDocument 404 /404/index.html

# 9. التخزين المؤقت للملفات ذات البصمة المشفرة (Cache-Control)
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresDefault "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType application/xml "access plus 1 hour"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# 10. تفعيل ضغط Gzip لتسريع التصفح
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript application/json application/xml
</IfModule>
```

---

### 6. خطوات التحقق بعد النشر (Deployment Verification Checklist)

بعد الانتهاء من رفع الملفات، قم بفتح المتصفح في وضع التصفح الخفي وتحقق من التالي:

1. **فحص الرابط الرئيسي**:
   - افتح `https://misterpistachio.com/` -> يجب أن يحولك مباشرة برمز حالة 301 إلى `https://misterpistachio.com/ar/`.
2. **فحص الروابط المباشرة وتحديث الصفحة (F5 Refresh)**:
   - ادخل مباشرة إلى `https://misterpistachio.com/ar/ucb1/` واضغط تحديث (Refresh) -> يجب أن تظهر الصفحة فوراً دون أي خطأ 404.
   - ادخل مباشرة إلى أحد المقالات: `https://misterpistachio.com/ar/articles/pistachio-orchard-guide/` -> يجب أن يظهر محتوى المقال مسبق التصيير فوراً.
3. **فحص تبديل اللغة**:
   - في صفحة المقال، اضغط زر تغيير اللغة إلى English -> يجب أن ينتقل الرابط بسلاسة إلى النسخة الإنجليزية المقابلة.
4. **فحص صفحة الخطأ 404**:
   - اكتب رابطاً عشوائياً غير موجود: `https://misterpistachio.com/ar/page-not-found-test` -> يجب أن تظهر صفحة الخطأ المخصصة 404 مع كود الحالة `404 Not Found` (وليس تحويلاً ناعماً إلى الرئيسية).
5. **فحص خريطة الموقع وملف الروبوت**:
   - افتح `https://misterpistachio.com/robots.txt` -> تأكد من ظهور الرابط الصحيح لخريطة الموقع.
   - افتح `https://misterpistachio.com/sitemap.xml` -> تأكد من سرد الروابط الـ 28 والوسوم البديلة.

---

### 7. آلية إضافة مقالات جديدة مستقبلاً (Adding Future Articles Workflow)

لإضافة مقال جديد شهرياً وتحديث الموقع بسهولة تامة:

1. **إضافة بيانات المقال**:
   - افتح ملف `src/assets/data/articles/ar.json` وأضف كائن المقال العربي متضمناً:
     - `id`: المعرف المشترك باللغة الإنجليزية (مثلاً: `soil-salinity-pistachio`).
     - `slug`: الرابط اللطيف للمقال (يمكن أن يكون بالإنجليزية أو بالعربية).
     - `title`: عنوان المقال.
     - `seo`: العنوان والوصف لمحركات البحث.
     - `content`: فقرات وعناوين وصور المقال.
   - افتح ملف `src/assets/data/articles/en.json` وأضف الترجمة الإنجليزية المقابلة بنفس الـ `id`.

2. **تشغيل أمر البناء**:
   ```bash
   npm run build
   ```
   يقوم النظام تلقائياً بـ:
   - استخراج الـ `slug` الجديد من ملف JSON.
   - تصيير صفحة HTML كاملة للمقال الجديد في المسار:
     `dist/project/browser/ar/articles/[slug]/index.html` و `dist/project/browser/en/articles/[slug]/index.html`.
   - إضافة المقال الجديد بروابط لغاته البديلة وتاريخ نشره إلى `dist/project/browser/sitemap.xml`.

3. **رفع التحديث**:
   - يمكنك إما إعادة رفع ملف `deploy.zip` بالكامل، أو ببساطة رفع مجلد المقال الجديد وملف `sitemap.xml` فقط إلى استضافتك في هوستنجر.

---

### 8. خطوات تفعيل وإعادة إرسال خريطة الموقع في Google Search Console

1. سجل الدخول إلى [Google Search Console](https://search.google.com/search-console).
2. اختر الخاصية المسجلة: `https://misterpistachio.com/`.
3. تم تضمين ملف التحقق `google2ae79b6d87c194b1.html` في مجلد `public/` ويتم رفعه تلقائياً مع المخرجات.
4. **حل مشكلة خريطة الموقع (Fix Sitemap Status)**:
   - بعد رفع ملف `sitemap.xml` المحدث والملفات المصيرة إلى `public_html`، افتح قائمة **Sitemaps** في الشريط الجانبي في Google Search Console.
   - إذا كانت الخريطة القديمة تظهر بحالة `Couldn't fetch`:
     - اضغط على الخريطة السابقة في الجدول ثم اضغط على النقاط الثلاث بالأعلى واختر **Remove sitemap** (حذف خريطة الموقع).
     - في خانة **Add a new sitemap**، اكتب مجدداً: `sitemap.xml` واضغط **Submit**.
   - يقوم Googlebot فوراً بطلب الملف `https://misterpistachio.com/sitemap.xml`.
   - ستتحول الحالة فوراً إلى اللون الأخضر **Success** وسيتم اكتشاف جميع الروابط الـ 28 (Discovered pages: 28).
   - ملاحظة: في حال تفعيل التخزين المؤقت CDN في هوستنجر، قم بالدخول إلى hPanel -> Performance -> Cache واضغط **Purge All** لضمان وصول جوجل للإصدار الجديد فوراً.

---

### 9. قيود الاستضافة والملاحظات الفنية (Hosting Boundaries)

- **غياب خادم Node.js النشط**: خطة Hostinger Premium Web Hosting لا تتضمن خادم Node.js دائم التشغيل؛ لذلك فإن التصيير الثابت (Static Prerendering) هو الخيار الهندسي الأمثل والأكثر موثوقية وثباتاً وأماناً ضد توقف السيرفر.
- **تحديث المقالات الفوري**: نظراً لكون الموقع مسبق التصيير (Static)، فإن نشر مقال جديد يتطلب إعادة تشغيل أمر `npm run build` ورفع المخرجات، ولا يمكن تعديل المحتوى عبر لوحة تحكم ديناميكية دون إعادة بناء الحزمة.
