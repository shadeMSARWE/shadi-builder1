// 1. تهيئة Supabase باستخدام بيانات مشروعك shadi-builder1
const supabaseUrl = 'https://xfzelmpwthqywidyjgzo.supabase.co'; //
const supabaseKey = 'sb_publishable_1T-D3i1El5LLR94ev4RQWA_2zRULS9H'; //
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. دالة تسجيل الدخول بجوجل
async function signInWithGoogle() {
    const { error } = await _supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: 'http://localhost:3000' // الرابط المعتمد في Dashboard
        }
    });
    if (error) console.error("Login Error:", error.message);
}

// 3. دالة التوليد الأساسية المربوطة بنظام الحماية
async function generate() {
    const description = document.getElementById("desc").value;
    const statusOut = document.getElementById("out");
    const buildBtn = document.querySelector("button"); 

    // فحص الجلسة للتأكد من هوية المستخدم
    const { data: { session } } = await _supabase.auth.getSession();
    
    if (!session) {
        statusOut.innerHTML = `
            <div class="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg text-yellow-400">
                ⚠️ يا شادي، سجل دخول بجوجل أولاً عشان تقدر تبني موقعك!
            </div>`;
        setTimeout(() => signInWithGoogle(), 2000); 
        return;
    }

    if (!description) {
        alert("اكتب وصفاً للموقع يا بطل! 🚀");
        return;
    }

    // تفعيل واجهة البناء
    buildBtn.disabled = true;
    buildBtn.innerText = "جاري البناء... 🏗️";
    statusOut.innerHTML = `
        <div class="flex flex-col gap-2 text-indigo-400 font-mono text-sm p-4 bg-slate-900 rounded-lg border border-slate-800">
            <p>> مستخدم موثق: ${session.user.email} ✅</p>
            <p>> جاري استدعاء المحلل الذكي... 🧠</p>
            <div class="animate-pulse">⏳ جاري تخطيط الهيكل لـ "${description}"...</div>
        </div>
    `;

    try {
        // إرسال الطلب للسيرفر مع معرف المستخدم الفريد لحفظه في جدول projects
        const res = await fetch("/api/brain/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                description,
                userId: session.user.id 
            })
        });

        const data = await res.json();

        if (data.ok && data.projectId) {
            statusOut.innerHTML = `
                <div class="p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 font-bold">
                    <p>✅ تم النصر! تم بناء شركة: ${data.project.website_name}</p>
                </div>
            `;
            
            setTimeout(() => {
                window.open(`/generated/${data.projectId}/index.html`, "_blank");
                buildBtn.disabled = false;
                buildBtn.innerText = "ابدأ مشروعاً جديداً 🚀";
            }, 1200);

        } else {
            statusOut.innerHTML = `<div class="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">❌ فشل المحرك: ${data.error}</div>`;
            buildBtn.disabled = false;
        }
    } catch (error) {
        statusOut.innerHTML = `<div class="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 font-bold">🔥 خطأ اتصال! تأكد أن السيرفر شغال.</div>`;
        buildBtn.disabled = false;
    }
}