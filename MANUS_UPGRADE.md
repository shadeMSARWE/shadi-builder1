# ترقية منصة Shadi AI إلى مستوى Manus

هذا الملف يلخص الميزات المضافة وخطوات التشغيل.

---

## 1. نظام النقاط (Credits) مع Supabase

- **كل مستخدم جديد** يحصل على **500 نقطة مجانية** عند أول تفاعل مع الـ API (تسجيل الدخول ثم طلب `/api/v1/users/me` أو أي طلب محمي).
- استهلاك التوليد: **10 نقاط لكل موقع** مُولَّد.

**خطوات التنفيذ في Supabase:**

1. من Supabase Dashboard → SQL Editor نفّذ محتوى الملف:
   - `supabase/migrations/001_profiles_credits.sql`
2. التأكد من وجود المتغيرات في `.env`:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (للباكند للقراءة/الكتابة على `profiles`)

---

## 2. بوابة الدفع PayPal

- إنشاء طلب دفع: `POST /api/v1/payments/create-order` مع `{ "bundleId": "credits_500" }` (أو غيرها من الباقات).
- استكمال الدفع وإضافة النقاط: `POST /api/v1/payments/capture` مع `{ "orderId": "..." }`.
- عرض الباقات: `GET /api/v1/payments/bundles`.

**متغيرات البيئة:**

- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_MODE` = `sandbox` أو `live`

**جدول في Supabase:** نفّذ `supabase/migrations/002_payment_orders.sql`.

**الحزم:** أضف في المشروع ثم شغّل `npm install`:

```bash
npm install @paypal/checkout-server-sdk
```

---

## 3. توليد المواقع (HTML و CSS و JS منفصلة)

- المُولِّد يكتب داخل مجلد المشروع في **`generated/<projectId>/`**:
  - `index.html`
  - `styles.css`
  - `script.js`
- المعاينة عبر: `/generated/<projectId>/index.html`.
- التحميل كـ ZIP عبر: `GET /api/v1/projects/export/:id`.

---

## 4. نظام الفيديوهات (هيكلية برمجية)

- **المدة:** من 5 ثوانٍ إلى 10 دقائق.
- **الأنماط:** `realistic` | `cartoon`.
- الـ API:
  - `GET /api/v1/videos/spec` — مواصفات مسموحة.
  - `POST /api/v1/videos` — إنشاء طلب فيديو: `{ "description", "durationSeconds", "style" }`.
  - `GET /api/v1/videos` — قائمة فيديوهات المستخدم.
  - `GET /api/v1/videos/:id` — تفاصيل فيديو.
- الحفظ مرتبط بمجلد `generated/_videos/` (نفس جذر المشروع).
- ربط محرك فيديو فعلي (Runway / Pika / غيره) يتم لاحقاً داخل `src/core/videos/service.js`.

---

## 5. Prompt Enhancer (تحسين الوصف)

- **Endpoint:** `POST /api/v1/brain/enhance-prompt` مع `{ "description": "..." }`.
- يعتمد على **OpenAI** (`OPENAI_API_KEY`) لتحسين وصف المستخدم قبل التوليد.
- في واجهة التوليد (`generate.html`) يوجد زر **「تحسين الوصف (Prompt Enhancer)」** يملأ الحقل بالوصف المحسّن ويعرض اقتراحات.

---

## 6. مسارات الحفظ الموحدة

- مصدر واحد للمسار: **`src/config/paths.js`** يصدّر `GENERATED_DIR` (مجلد `generated` في جذر المشروع).
- السيرفر ومسارات المواقع والفيديو والتصدير تستخدم هذا المسار لتجنب أخطاء 404.

---

## تشغيل المشروع

```bash
npm install
npm start
```

تأكد من تعبئة `.env` حسب الأقسام أعلاه (Supabase، PayPal، OpenAI عند استخدام التحسين والمواقع).
