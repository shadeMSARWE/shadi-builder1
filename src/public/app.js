/* ======================================================
   SHADI BUILDER – AUTH + GENERATE (PRODUCTION FINAL FIX)
====================================================== */

// 1️⃣ Supabase config (Production)
const supabaseUrl = "https://xfzelmpwthqywidyjgzo.supabase.co";
const supabaseKey = "sb_publishable_1T-D3i1El5LLR94ev4RQWA_2zRULS9H";

const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      detectSessionInUrl: true,   // 🔥 الحل الأساسي
      persistSession: true,
      autoRefreshToken: true
    }
  }
);

// 2️⃣ أول ما الصفحة تفتح → افحص الجلسة أو الـ hash
(async () => {
  const { data, error } = await supabase.auth.getSession();

  if (data?.session) {
    // نظّف الرابط من #access_token
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );

    // حوّل مباشرة
    if (!window.location.pathname.includes("generate.html")) {
      window.location.href = "/generate.html";
    }
  }
})();

// 3️⃣ Listener احتياطي (لو الجلسة إجت متأخرة)
supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_IN" && session) {
    if (!window.location.pathname.includes("generate.html")) {
      window.location.href = "/generate.html";
    }
  }
});

// 4️⃣ تسجيل الدخول بجوجل
async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        "https://shadi-builder1-production.up.railway.app"
      // ⬆️ خلي الرجوع على /
      // index.html هو اللي يحوّل
    }
  });

  if (error) {
    console.error("Login Error:", error.message);
    alert("❌ فشل تسجيل الدخول");
  }
}

// 5️⃣ تسجيل الخروج
async function logout() {
  await supabase.auth.signOut();
  localStorage.clear();
  window.location.href = "/";
}

// 6️⃣ توليد الموقع (محمي)
async function generate() {
  const description = document.getElementById("desc")?.value?.trim();
  const statusOut = document.getElementById("out");
  const buildBtn = document.querySelector("button");

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    alert("سجّل دخول أولاً");
    signInWithGoogle();
    return;
  }

  if (!description) {
    alert("اكتب وصف الموقع أولاً 🚀");
    return;
  }

  buildBtn.disabled = true;
  buildBtn.innerText = "جاري البناء... 🏗️";

  try {
    const res = await fetch("/api/v1/brain/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + session.access_token
      },
      body: JSON.stringify({ description })
    });

    const data = await res.json();
    if (!data.ok) throw new Error(data.error || "Build failed");

    window.open(data.previewUrl, "_blank");

  } catch (err) {
    alert("❌ " + err.message);
  } finally {
    buildBtn.disabled = false;
    buildBtn.innerText = "ابدأ مشروعاً جديداً 🚀";
  }
}
