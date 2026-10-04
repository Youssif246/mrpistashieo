# خطة واستراتيجية تحسين محركات البحث الشاملة (SEO)
## موقع مستر بستاشيو (Mister Pistachio) — تخصص زراعة وإنتاج الفستق الحلبي
**التقنية:** Angular 21 (Standalone Components, SSR / Prerendering via `@angular/ssr`)  
**تاريخ الفحص والتدقيق:** أكتوبر 2026

---

## 1. نتائج تدقيق ومراجعة الكود الحالي (Audit Findings)

تم إجراء تدقيق فني شامل ومفصل لكود المشروع وملفات التوجيه والترجمة والخادم:

| # | معيار الفحص | الحالة الحالية في المشروع | التأثير الفني والتحليلي |
|---|---|---|---|
| **1** | **إصدار Angular والبنية** | Angular `v21.1.0`، مع `@angular/ssr: 21.1.3` ومكونات مستقلة (Standalone). | بنية معمارية حديثة ومؤهلة لدعم التوليد المسبق (SSG/Prerender) وتقديم الخادم (SSR). |
| **2** | **هيكلة الروابط (Routing)** | روابط إنجليزية مفردة بدون لغة في [app.routes.ts](file:///c:/Users/Elhamd/Desktop/mr%20pistatieo/project/src/app/app.routes.ts): `/`, `/about`, `/services`, `/varieties`, `/usb1`, `/articles`, `/articles/:slug`, `/contact`. | **مشكلة حرجة:** لا يوجد تمييز بين مسار عربي ومسار إنجليزي في الرابط. |
| **3** | **نظام الترجمة الحالي** | يعتمد على [translation.service.ts](file:///c:/Users/Elhamd/Desktop/mr%20pistatieo/project/src/app/shared/translation.service.ts) عبر `signal<Language>('en')` والتخزين في `localStorage`. | محركات البحث (Googlebot) لا تنفذ الـ `localStorage`؛ وعليه سيرى محرك البحث النسخة الإنجليزية فقط دائماً. |
| **4** | **ملفات الترجمة JSON** | ملفات كاملة ومنسقة جداً: [ar.json](file:///c:/Users/Elhamd/Desktop/mr%20pistatieo/project/src/assets/i18n/ar.json) و [en.json](file:///c:/Users/Elhamd/Desktop/mr%20pistatieo/project/src/assets/i18n/en.json) و 7 مقالات متكاملة باللغتين. | المحتوى العربي قوي وغني بالمصطلحات الزراعية، لكنه محجوب عن الفهرسة بسبب غياب روابط مخصصة. |
| **5** | **تغيير الرابط عند تبديل اللغة** | **الرابط لا يتغير نهائياً.** | تصفح الصفحة بالعربي أو الإنجليزي يكون تحت نفس الرابط تماماً، مما يمنع جوجل من أرشفة النسخة العربية. |
| **6** | **إعداد التوليد المسبق (Prerender)** | مفعل في [app.routes.server.ts](file:///c:/Users/Elhamd/Desktop/mr%20pistatieo/project/src/app/app.routes.server.ts) ولكن `getPrerenderParams` يقرأ مقالات `en.json` فقط. | الخادم يولد صفحات HTML مسبقة للإنجليزي فقط؛ الصفحات العربية لا يتم توليد ملفات HTML ثابتة لها. |
| **7** | **العناوين (`<title>`) والوصف (`description`)** | ثابتة باللغة الإنجليزية في [app.routes.ts](file:///c:/Users/Elhamd/Desktop/mr%20pistatieo/project/src/app/app.routes.ts) و [index.html](file:///c:/Users/Elhamd/Desktop/mr%20pistatieo/project/src/index.html). | الصفحات الرئيسية (الرئيسية، من نحن، الخدمات، الأصناف، UCB1، التواصل) لا تملك عناوين ووصف عربي ديناميكي. |
| **8** | **الوسوم الأساسية (Canonical & hreflang)** | **غير موجودة تماماً** في المشروع. | خطر اعتبار المحتوى مكرراً (Duplicate Content) وغياب ربط اللغات معاً لدى جوجل. |
| **9** | **خريطة الموقع (sitemap.xml)** | **غير موجودة.** | يصعب على عناكب البحث اكتشاف الصفحات والمقالات وتحديثاتها بانتظام. |
| **10** | **ملف التوجيه (robots.txt)** | **غير موجود.** | لا توجد تعليمات واضحة لعناكب البحث أو إشارة لمكان الـ Sitemap. |
| **11** | **الروابط الخاطئة والـ 404** | مسار التحويل العام `{ path: '**', redirectTo: '' }`. | تحويل الصفحات غير الموجودة إلى الرئيسية مع كود 200 OK يُعتبر **Soft 404 penalty** لدى جوجل. |
| **12** | **البيانات المنظمة (Structured Data / Schema)** | موجودة فقط للمقالات في المتصفح فقط (`if (isBrowser)`). | غير مقروءة لعناكب الخادم (SSR)، وتغيب عن المنظمة (`Organization`) والموقع (`WebSite`). |
| **13** | **حجم الصور والأداء** | 5 صور أساسية في الصفحة الرئيسية بصيغة PNG غير مضغوطة بحجم يزيد عن 13 ميجابايت. | بطء كبير في مؤشر سرعة تحميل أكبر عنصر مرئي (LCP) ويؤثر على نقاط Core Web Vitals. |

---

## 2. المشاكل المكتشفة وأسباب ضرورة حلها (Core Problems)

1. **فخ الرابط الواحد للغتين (The Single-URL Multilingual Trap):**
   جوجل يخصص فهرسته بناءً على عناوين URL فريدة. وجود اللغة العربية فقط في الذاكرة المحلية للمتصفح (`localStorage`) يجعل موقعك العربي غير مرئي تماماً في نتائج البحث باللغة العربية!
2. **غياب وسوم اللغات البديلة (`hreflang`):**
   عندما لا نخبر جوجل أن النسخة العربية هي المقابل الدقيق للنسخة الإنجليزية، تتنافس الصفحات مع بعضها أو تُهمل إحداهما.
3. **عقوبة الـ Soft 404:**
   إعادة توجيه أي رابط مكسور إلى الصفحة الرئيسية يعطي انطباعاً لجوجل بأن موقعك يحتوي على صفحات وهمية مكررة بدلاً من إرجاع رمز الخطأ 404 الحقيقي.
4. **حمولة الصور الضخمة:**
   أكثر من 13 ميجابايت صور في الصفحة الأولى تبطئ تقييم الموقع في Google PageSpeed وCore Web Vitals، وهو عامل ترتيب رسمي لدى جوجل.

---

## 3. المعمارية المقترحة للروابط متعددة اللغات (URL Architecture)

### التوصية المعتمدة والمعيارية لدى جوجل:
استخدام مسارات اللغة كبادئة واضحة (Prefix):
* **المسار العربي:**
  * `https://misterpistachio.com/ar/` (الرئيسية)
  * `https://misterpistachio.com/ar/about` (من نحن)
  * `https://misterpistachio.com/ar/services` (الخدمات)
  * `https://misterpistachio.com/ar/varieties` (الأصناف والأصول)
  * `https://misterpistachio.com/ar/usb1` (أصل UCB1)
  * `https://misterpistachio.com/ar/articles` (المقالات)
  * `https://misterpistachio.com/ar/articles/pistachio-orchard-guide` (تفاصيل المقال)
  * `https://misterpistachio.com/ar/contact` (التواصل)

* **المسار الإنجليزي:**
  * `https://misterpistachio.com/en/`
  * `https://misterpistachio.com/en/about`
  * `https://misterpistachio.com/en/services`
  * `https://misterpistachio.com/en/varieties`
  * `https://misterpistachio.com/en/usb1`
  * `https://misterpistachio.com/en/articles`
  * `https://misterpistachio.com/en/articles/pistachio-orchard-guide`
  * `https://misterpistachio.com/en/contact`

* **المسار الرئيسي الجذر (`/`):**
  * يفحص لغة المتصفح أو الاختيار السابق للمستخدم ويقوم بتوجيهه بسلاسة إلى `/ar/` أو `/en/`.
  * يحمل وسم `hreflang="x-default"` ليكون الوجهة العالمية الافتراضية.

### الحفاظ على كود الترجمة الحالي (`TranslationService`):
* لن نقوم بإعادة بناء الترجمة من الصفر.
* يتم ربط الـ `signal` للغة الحالية تلقائياً بالرابط النشط (`/ar/` يفعّل `arData`، و`/en/` يفعّل `enData`).
* **النتيجة:** 100% من القوالب والمكونات الحالية ستعمل كما هي دون تعديل المتغيرات أو الإخلال بتصميم الموقع!

---

## 4. استراتيجية البيانات الوصفية (Page-by-Page Metadata)

سيتم إنشاء خدمة موحدة (`SeoService`) لتحديث العناوين والوصف والوسوم لكل صفحة حسب اللغة:

| الصفحة | اللغة | العنوان المخصص في جوجل (`<title>`) | الوصف التعريفي المخصص (`description`) |
|---|---|---|---|
| **الرئيسية** | **عربي** | مستر بستاشيو \| مشاتل متخصصة في زراعة وإنتاج الفستق الحلبي | مشتل زراعي رائد متخصص في إكثار أصول الفستق الحلبي المعتمدة (UCB1، البطم)، وتأسيس البساتين النموذجية بأعلى المعايير الإسبانية والعالمية. |
| | **EN** | Mister Pistachio \| Specialist Pistachio Nursery & Plantation Engineering | Certified pistachio nursery specializing in clonal rootstocks (UCB1, Atlantica), grafted saplings, and precision Mediterranean orchard establishment. |
| **من نحن** | **عربي** | من نحن \| شراكة زراعية إسبانية متخصصة في الفستق الحلبي \| مستر بستاشيو | تعرف على مستر بستاشيو: خبرة إسبانية متقدمة في علوم إكثار أصول الفستق الحلبي وتطوير المشاتل وإنشاء المشاريع الزراعية الاستثمارية المستدامة. |
| | **EN** | About Us \| Spanish-Mediterranean Pistachio Specialists \| Mister Pistachio | Discover Mister Pistachio: A dedicated Spanish agricultural partnership bringing advanced pistachio biotechnology, clonal rootstocks, and field expertise. |
| **الخدمات** | **عربي** | الخدمات الزراعية وهندسة بساتين الفستق الحلبي \| مستر بستاشيو | خدمات زراعية متكاملة: دراسات التربة والمناخ، شبكات الري الذكي، التطعيم الحقلي، والإشراف الفني الشامل على بساتين الفستق التجاري. |
| | **EN** | Agricultural Services & Orchard Engineering \| Mister Pistachio | Turnkey agricultural solutions: soil mechanics analysis, precision drip irrigation design, field budding, and complete pistachio orchard management. |
| **الأصناف** | **عربي** | أصناف الفستق الحلبي والأصول المعتمدة \| مستر بستاشيو | دليل أصناف الفستق الحلبي التجارية (سيرورا، كرمان، باتورنو) والأصول المقاومة (UCB1، بطم أطلسي، كورنيكابرا) بأعلى نقاوة وراثية. |
| | **EN** | Commercial Pistachio Varieties & Certified Rootstocks \| Mister Pistachio | High-yield pistachio scion cultivars (Sirora, Kerman, Peter) and elite rootstocks (UCB1, P. atlantica, Cornicabra) with certified phytosanitary standards. |
| **UCB1** | **عربي** | أصل الفستق الهجين UCB1 \| مقاومة الجفاف والأمراض الإنتاجية \| مستر بستاشيو | الدليل العلمي الشامل لأصل الفستق الهجين UCB1: نمو فائق السرعة، مقاومة لمرض الفيرتيسيليوم، وملاءمة مثالية للتربة القلوية وشح المياه. |
| | **EN** | UCB1 Hybrid Pistachio Rootstock \| Vigor & Disease Resistance \| Mister Pistachio | The definitive technical guide to clonal UCB-1 pistachio rootstock: Verticillium wilt resistance, rapid caliper growth, and high-salinity tolerance. |
| **المقالات** | **عربي** | مقالات وأبحاث زراعة الفستق الحلبي \| دراسات تطبيقية \| مستر بستاشيو | مكتبة معرفية زراعية متخصصة تضم دراسات حقلية وإرشادات علمية في تسميد، تقليم، ري، وتأسيس مزارع الفستق الحلبي الاستثمارية. |
| | **EN** | Agricultural Articles & Pistachio Cultivation Research \| Mister Pistachio | Authoritative agronomic library featuring field-tested guides on nutrition, pruning, deficit irrigation, and commercial orchard viability. |
| **التواصل** | **عربي** | تواصل مع فريقنا الزراعي والاستشاري \| مستر بستاشيو | تواصل مع مهندسي مستر بستاشيو لحجز الشتلات المعتمدة، طلب دراسات الجدوى الحقلية، أو الحصول على استشارة زراعية مخصصة عبر واتساب والهاتف. |
| | **EN** | Contact Our Agricultural Advisory Team \| Mister Pistachio | Inquire about certified pistachio saplings, reserve seasonal rootstock batches, or schedule an agronomic consultation with our Mediterranean specialists. |

---

## 5. الجوانب الفنية والتقنية (Technical SEO Roadmap)

### أ. إنشاء خريطة الموقع (`public/sitemap.xml`):
تضمين كافة الروابط باللغتين العربية والإنجليزية مع إشارات الربط التبادلي (`xhtml:link rel="alternate"`):
```xml
<url>
  <loc>https://misterpistachio.com/ar/services</loc>
  <xhtml:link rel="alternate" hreflang="ar" href="https://misterpistachio.com/ar/services"/>
  <xhtml:link rel="alternate" hreflang="en" href="https://misterpistachio.com/en/services"/>
  <lastmod>2026-10-05</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
</url>
```

### ب. إنشاء ملف الروبوت (`public/robots.txt`):
```txt
User-agent: *
Allow: /

Sitemap: https://misterpistachio.com/sitemap.xml
```

### ج. معالجة الصفحات المفقودة (404 Page):
* إنشاء مكون أنيق لصفحة غير موجودة (`NotFoundComponent`).
* إرجاع كود الحالة الفعلي 404 بدلاً من التحويل الصامت للصفحة الرئيسية.

### د. البيانات المنظمة (Schema.org / JSON-LD):
1. **بيانات المنظمة (`Organization`):** اسم الشركة (Mister Pistachio S.L.)، الشعار، أرقام الهاتف، البريد، ومواقع التواصل الاجتماعي.
2. **بيانات الموقع (`WebSite`):** اسم الموقع واللغات المدعومة.
3. **بيانات المقالات (`BlogPosting` / `Article`):** إدراجها داخل كود الـ HTML الأولي المقروء مباشرة من قِبل الخادم (SSR).
4. **مسار التنقل (`BreadcrumbList`):** لتسهيل تنقل العناكب وإظهار المسار بوضوح في نتائج بحث جوجل.

---

## 6. تحسين الأداء ومؤشرات الويب الأساسية (Core Web Vitals)

1. **تحويل وضغط الصور:**
   * تحويل الصور الرئيسية الخمس (`hero.png`, `nursery.png`, `harvest.png`, `pistachio-detail.png`, `cta.png`) من PNG بحجم ~13.5MB إلى صيغة **WebP** الحديثة لتقليل الحجم بأكثر من 85% ليصبح أقل من 1.5MB إجمالاً.
2. **تسريع تحميل صورة البانر (LCP Preload):**
   * إضافة `<link rel="preload" as="image" href="..." fetchpriority="high">` في وسم `<head>`.
3. **تحسين تحميل الخطوط:**
   * ضبط خطوط جوجل لتستخدم `font-display: swap` وتحميل الأوزان الضرورية فقط لتفادي حظر الرسم الأول للصفحة.

---

## 7. تصنيف المهام (Required vs Recommended vs Optional)

### 1. إلزامي وأساسي (REQUIRED)
1. تفعيل بنية الروابط اللغوية (`/ar/` و `/en/`) في [app.routes.ts](file:///c:/Users/Elhamd/Desktop/mr%20pistatieo/project/src/app/app.routes.ts).
2. مزامنة [TranslationService](file:///c:/Users/Elhamd/Desktop/mr%20pistatieo/project/src/app/shared/translation.service.ts) مع الرابط النشط ليعمل في المتصفح والخادم معاً.
3. تحديث [app.routes.server.ts](file:///c:/Users/Elhamd/Desktop/mr%20pistatieo/project/src/app/app.routes.server.ts) لتوليد الصفحات المسبقة للمقالات والمسارات باللغتين العربية والإنجليزية.
4. إنشاء خدمة `SeoService` لحقن العناوين والوصف ووسوم `canonical` و `hreflang` تلقائياً.
5. إنشاء ملفي `sitemap.xml` و `robots.txt` في مجلد `public`.
6. استبدال التوجيه الخاطئ `{ path: '**', redirectTo: '' }` بصفحة خطأ 404 مخصصة.

### 2. موصى به بشدة لتحسين الترتيب (RECOMMENDED)
1. تحويل الصور الكبيرة إلى صيغة WebP المضغوطة لتسريع مؤشرات LCP.
2. إضافة بطاقات المشاركة الاجتماعية (Open Graph & Twitter Cards) لجميع الصفحات.
3. تفعيل البيانات المنظمة `Organization` و `BreadcrumbList` في الخادم.
4. إضافة روابط تنقل مسارية (Breadcrumbs) في تفاصيل المقالات.

### 3. خيارات مستقبلية (OPTIONAL / FUTURE)
1. دعم عناوين مقالات فرعية معربة (Arabic Slug Aliases).
2. سكريبت أوتوماتيكي يقوم بتحديث الـ sitemap تلقائياً عند إضافة مقالات جديدة.

---

## 8. قائمة التحقق بعد التنفيذ (Validation Checklist)

- [ ] فحص الرابط: زيارة `/ar/about` تعرض المحتوى العربي باتجاه RTL ولغة `ar`.
- [ ] فحص زر تبديل اللغة: الضغط على زر اللغة ينقلك مباشرة للرابط المقابل (`/en/about`).
- [ ] فحص كود المصدر (View Source): فتح سورس الصفحة في مقال عربي يعرض النص العربي الكامل داخل HTML وليس قالباً فارغاً.
- [ ] فحص الـ Canonical: وسم `<link rel="canonical">` يشير بدقة للرابط المعروض.
- [ ] فحص الـ hreflang: وجود وسوم تبادلية صحيحة لـ `ar` و `en` و `x-default`.
- [ ] اختبار أداة النتائج الغنية من جوجل (Google Rich Results): التأكد من صحة بيانات `Article` و `Organization`.
- [ ] فحص خريطة الموقع: الدخول إلى `/sitemap.xml` والتأكد من خلوه من أخطاء الـ XML.
- [ ] فحص ملف الروبوت: الدخول إلى `/robots.txt` والتأكد من قراءته.
- [ ] فحص اختبار السرعة (Lighthouse): انخفاض زمن LCP بشكل ملحوظ بعد تحسين الصور.
