/* ======================================================
   FERDOUS AI – AUTH + STUDIO
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

// 2️⃣ فحص فوري ومباشر عند فتح الصفحة
async function checkAuth() {
    const { data } = await supabase.auth.getSession();
    
    // إذا فيه جلسة أو فيه توكن في الرابط فوق
    if (data?.session || window.location.hash.includes('access_token')) {
        console.log("تم كشف المفتاح.. جاري الانتقال لصفحة البناء 🏗️");
        
        // إذا كنا بصفحة index أو login، نحول فوراً لـ generate
        if (!window.location.pathname.includes("generate.html")) {
            window.location.href = "/generate.html";
        }
    }
}

// شغل الفحص أول ما الملف يفتح
checkAuth();

// 3️⃣ المستشعر الاحتياطي
supabase.auth.onAuthStateChange((event, session) => {
  if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session) {
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
      // تعديل مهم: التوجيه لصفحة الـ generate مباشرة
      redirectTo: "https://shadi-builder1-production.up.railway.app/generate.html"
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
  window.location.href = "/index.html";
}

// 6️⃣ توليد الموقع (محمي)
async function generate() {
  const description = document.getElementById("desc")?.value?.trim();
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
        "Authorization": "Bearer " + session.access_token
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