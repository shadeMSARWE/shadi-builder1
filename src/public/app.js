/* ======================================================
   SHADI BUILDER – AUTH + GENERATE (PRODUCTION FINAL)
====================================================== */

// 1️⃣ Supabase config (Production)
const supabaseUrl = "https://xfzelmpwthqywidyjgzo.supabase.co";
const supabaseKey = "sb_publishable_1T-D3i1El5LLR94ev4RQWA_2zRULS9H";

const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

// 2️⃣ Redirect تلقائي بعد تسجيل الدخول
supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_IN" && session) {
    window.location.href = "/generate.html";
  }
});

// 3️⃣ تسجيل الدخول بجوجل (Railway URL)
async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        "https://shadi-builder1-production.up.railway.app/generate.html"
    }
  });

  if (error) {
    console.error("Login Error:", error.message);
    alert("❌ فشل تسجيل الدخول");
  }
}

// 4️⃣ تسجيل الخروج
async function logout() {
  await supabase.auth.signOut();
  localStorage.clear();
  window.location.href = "/";
}

// 5️⃣ توليد الموقع (محمي)
async function generate() {
  const description = document.getElementById("desc")?.value?.trim();
  const statusOut = document.getElementById("out");
  const buildBtn = document.querySelector("button");

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    statusOut.innerHTML = `
      <div class="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg text-yellow-400">
        ⚠️ سجل دخول بجوجل أولاً
      </div>
    `;
    setTimeout(signInWithGoogle, 1500);
    return;
  }

  if (!description) {
    alert("اكتب وصف الموقع أولاً 🚀");
    return;
  }

  buildBtn.disabled = true;
  buildBtn.innerText = "جاري البناء... 🏗️";

  statusOut.innerHTML = `
    <div class="p-4 bg-slate-900 border border-slate-800 rounded-lg text-indigo-400 text-sm">
      <p>👤 ${session.user.email}</p>
      <p class="animate-pulse">⏳ جاري البناء...</p>
    </div>
  `;

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

    statusOut.innerHTML = `
      <div class="p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 font-bold">
        ✅ تم بناء الموقع بنجاح
      </div>
    `;

    setTimeout(() => {
      window.open(data.previewUrl, "_blank");
      buildBtn.disabled = false;
      buildBtn.innerText = "ابدأ مشروعاً جديداً 🚀";
    }, 1200);

  } catch (err) {
    statusOut.innerHTML = `
      <div class="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
        ❌ ${err.message}
      </div>
    `;
    buildBtn.disabled = false;
    buildBtn.innerText = "حاول مرة أخرى";
  }
}
