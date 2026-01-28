/**
 * بوابة الدفع PayPal – إنشاء طلب واستكمال الدفع لإضافة النقاط
 */
const express = require("express");
const auth = require("../middleware/auth");
const { getBundle, BUNDLES } = require("../config/bundles");
const credits = require("../core/credits/service");
const supabase = require("../utils/supabase");

const router = express.Router();

function getPayPalClient() {
  const paypal = require("@paypal/checkout-server-sdk");
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const isLive = process.env.PAYPAL_MODE === "live";
  if (!clientId || !clientSecret) return null;
  const env = isLive
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
  return new paypal.core.PayPalHttpClient(env);
}

/**
 * POST /api/v1/payments/create-order
 * Body: { bundleId }
 * إنشاء أمر PayPal وربطه بالمستخدم وباقة النقاط
 */
router.post("/create-order", auth, async (req, res) => {
  try {
    const { bundleId } = req.body;
    const bundle = getBundle(bundleId);
    if (!bundle) {
      return res.status(400).json({ ok: false, error: "باقة غير صالحة" });
    }

    const client = getPayPalClient();
    if (!client) {
      return res.status(503).json({ ok: false, error: "بوابة الدفع غير مهيأة. راجع PAYPAL_CLIENT_ID و PAYPAL_CLIENT_SECRET." });
    }

    const paypal = require("@paypal/checkout-server-sdk");
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [{
        amount: {
          currency_code: bundle.currency,
          value: bundle.price
        },
        description: `باقة ${bundle.name} - Shadi AI Builder`
      }]
    });

    const response = await client.execute(request);
    const orderId = response.result.id;

    await supabase.from("payment_orders").insert({
      paypal_order_id: orderId,
      user_id: req.user.id,
      bundle_id: bundle.id,
      credits: bundle.credits,
      amount_value: bundle.price,
      currency: bundle.currency,
      status: "pending"
    });

    res.json({
      ok: true,
      orderId,
      bundle: { id: bundle.id, name: bundle.name, credits: bundle.credits }
    });
  } catch (err) {
    console.error("[Payments] create-order error:", err);
    res.status(500).json({ ok: false, error: "فشل إنشاء الطلب" });
  }
});

/**
 * POST /api/v1/payments/capture
 * Body: { orderId }
 * استكمال الدفع وإضافة النقاط للمستخدم
 */
router.post("/capture", auth, async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ ok: false, error: "معرف الطلب مطلوب" });
    }

    const { data: order, error: fetchError } = await supabase
      .from("payment_orders")
      .select("id, user_id, credits, status")
      .eq("paypal_order_id", orderId)
      .single();

    if (fetchError || !order) {
      return res.status(404).json({ ok: false, error: "طلب غير موجود" });
    }
    if (order.user_id !== req.user.id) {
      return res.status(403).json({ ok: false, error: "غير مصرح" });
    }
    if (order.status === "completed") {
      return res.json({ ok: true, alreadyCompleted: true, credits: order.credits });
    }

    const client = getPayPalClient();
    if (!client) {
      return res.status(503).json({ ok: false, error: "بوابة الدفع غير مهيأة" });
    }

    const paypal = require("@paypal/checkout-server-sdk");
    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderId);
    captureRequest.requestBody({});
    const captureResponse = await client.execute(captureRequest);
    const status = captureResponse.result.status;

    if (status !== "COMPLETED") {
      await supabase.from("payment_orders").update({ status: "failed" }).eq("id", order.id);
      return res.status(400).json({ ok: false, error: "لم يكتمل الدفع" });
    }

    await credits.addCredits(order.user_id, order.credits);
    await supabase
      .from("payment_orders")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", order.id);

    res.json({
      ok: true,
      creditsAdded: order.credits,
      totalCredits: await credits.getCredits(order.user_id)
    });
  } catch (err) {
    console.error("[Payments] capture error:", err);
    res.status(500).json({ ok: false, error: "فشل استكمال الدفع" });
  }
});

/**
 * GET /api/v1/payments/bundles
 * قائمة باقات النقاط (بدون تسجيل دخول للعرض في صفحة الأسعار)
 */
router.get("/bundles", (req, res) => {
  res.json({
    ok: true,
    bundles: BUNDLES.map((b) => ({
      id: b.id,
      name: b.name,
      credits: b.credits,
      price: b.price,
      currency: b.currency
    }))
  });
});

module.exports = router;
