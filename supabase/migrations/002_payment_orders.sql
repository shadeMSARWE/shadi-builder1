-- جدول طلبات الدفع (ربط أمر PayPal بالمستخدم والباقة)
CREATE TABLE IF NOT EXISTS public.payment_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paypal_order_id TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bundle_id TEXT NOT NULL,
  credits INTEGER NOT NULL,
  amount_value TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payment_orders_paypal ON public.payment_orders(paypal_order_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_user ON public.payment_orders(user_id);
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own orders"
  ON public.payment_orders FOR SELECT
  USING (auth.uid() = user_id);

-- الإدراج والتحديث من الخادم فقط (Service Role يتجاوز RLS)
