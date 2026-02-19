-- جدول profiles لربط المستخدمين بنقاطهم (Credits)
-- شغّل هذا الملف في SQL Editor في Supabase Dashboard

-- جدول يمتد على auth.users ويعطي كل مستخدم جديد 500 نقطة
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  credits INTEGER NOT NULL DEFAULT 500,
  plan TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- السياسة: المستخدم يرى سجله فقط
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- السياسة: المستخدم يحدّث سجله فقط (للعرض؛ الخصم يكون من السيرفر عبر Service Role)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- دالة تمنح 500 نقطة لأي مستخدم جديد عند أول ظهوره (يُستدعى من الباكند أو تريجر)
-- إنشاء البروفايل تلقائياً عند أول تسجيل دخول يتم عبر الباكند upsert

-- (اختياري) تريجر عند إنشاء مستخدم جديد في auth.users:
-- تحتاج إلى دالة تَنشئ صفاً في profiles من جانب الخادم أو edge function
-- الباكند الحالي يقوم بذلك عبر upsert في credits service

COMMENT ON TABLE public.profiles IS 'User profiles with credits; new users get 500 credits on first API access.';
