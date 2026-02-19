/**
 * نظام النقاط (Credits) مع Supabase
 * كل مستخدم جديد يحصل على 500 نقطة مجانية عند أول تفاعل مع الـ API
 */
const supabase = require("../../utils/supabase");

const INITIAL_CREDITS = 500;
const CREDITS_PER_SITE = 10;
const CREDITS_PER_VIDEO_PER_MINUTE = 50;

/**
 * التأكد من وجود بروفايل المستخدم وإرجاع رصيده. إن لم يكن له سجل يُنشأ ويعطى 500 نقطة.
 */
async function ensureProfile(userId) {
  const { data: existing, error: fetchError } = await supabase
    .from("profiles")
    .select("id, credits, plan")
    .eq("id", userId)
    .single();

  if (existing) return { credits: existing.credits, plan: existing.plan || "free" };

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("[Credits] ensureProfile fetch error:", fetchError);
    return { credits: 0, plan: "free" };
  }

  const { data: created, error: insertError } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      credits: INITIAL_CREDITS,
      plan: "free",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select("credits, plan")
    .single();

  if (insertError) {
    console.error("[Credits] ensureProfile insert error:", insertError);
    return { credits: 0, plan: "free" };
  }

  console.log(`[Credits] New user ${userId} granted ${INITIAL_CREDITS} credits`);
  return { credits: created.credits, plan: created.plan || "free" };
}

/**
 * رصيد المستخدم الحالي (بعد ensureProfile)
 */
async function getCredits(userId) {
  const p = await ensureProfile(userId);
  return p.credits;
}

/**
 * هل يستطيع المستخدم توليد موقع؟ (رصيد يكفي لموقع واحد)
 */
async function canGenerateSite(userId) {
  const credits = await getCredits(userId);
  return credits >= CREDITS_PER_SITE;
}

/**
 * خصم نقاط توليد موقع
 */
async function deductSite(userId) {
  const { data: row, error: fetchErr } = await supabase.from("profiles").select("credits").eq("id", userId).single();
  if (fetchErr || !row || row.credits < CREDITS_PER_SITE) return false;
  const { error: upErr } = await supabase
    .from("profiles")
    .update({
      credits: row.credits - CREDITS_PER_SITE,
      updated_at: new Date().toISOString()
    })
    .eq("id", userId);
  return !upErr;
}

/**
 * خصم نقاط فيديو (حسب الدقائق)
 */
async function deductVideo(userId, durationMinutes) {
  const amount = Math.max(CREDITS_PER_VIDEO_PER_MINUTE, Math.ceil(durationMinutes) * CREDITS_PER_VIDEO_PER_MINUTE);
  return deductVideoByAmount(userId, amount);
}

/**
 * خصم مقدار محدد من النقاط (فيديو حسب المدة/النمط/الصوت)
 */
async function deductVideoByAmount(userId, amount) {
  const { data: row, error: fetchErr } = await supabase.from("profiles").select("credits").eq("id", userId).single();
  if (fetchErr || !row || row.credits < amount) return false;
  const { error } = await supabase
    .from("profiles")
    .update({
      credits: row.credits - amount,
      updated_at: new Date().toISOString()
    })
    .eq("id", userId);
  return !error;
}

/**
 * إضافة نقاط (بعد شراء باقة أو مكافأة)
 */
async function addCredits(userId, amount) {
  await ensureProfile(userId);
  const { data: row } = await supabase.from("profiles").select("credits").eq("id", userId).single();
  const current = (row && row.credits) || 0;
  const { error } = await supabase
    .from("profiles")
    .update({
      credits: current + amount,
      updated_at: new Date().toISOString()
    })
    .eq("id", userId);
  return !error;
}

module.exports = {
  INITIAL_CREDITS,
  CREDITS_PER_SITE,
  CREDITS_PER_VIDEO_PER_MINUTE,
  ensureProfile,
  getCredits,
  canGenerateSite,
  deductSite,
  deductVideo,
  deductVideoByAmount,
  addCredits
};
