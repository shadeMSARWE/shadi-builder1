/**
 * Prompt Enhancer – تحسين وصف المستخدم قبل التوليد لنتائج أفضل (مثل Manus)
 */
const openai = require("../../utils/openai");

const SYSTEM = `أنت خبير في كتابة أوصاف المواقع والتطبيقات. مهمتك تحسين الوصف الذي يرسله المستخدم قبل إرساله لمولد مواقع بالذكاء الاصطناعي.

قواعدك:
- أبقِ الفكرة الأصلية واللغة (عربي أو إنجليزي) كما هي.
- أضف تفاصيل واضحة عن: نوع الموقع، الألوان أو النمط المطلوب، الأقسام الأساسية (مثل: رئيسية، خدمات، تواصل، أسعار).
- اجعل الجملة من 2–4 أسطر واضحة وقابلة للتنفيذ تقنياً.
- لا تخترع اسم شركة أو ماركة ما لم يذكرها المستخدم.
- أعد الرد بصيغة JSON فقط: { "enhanced": "الوصف المحسّن هنا", "suggestions": "جملة أو جملتان تشرح ما أضفته للمستخدم" }`;

async function enhancePrompt(description) {
  const text = (description || "").trim();
  if (!text) {
    return { ok: false, error: "الوصف فارغ" };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: `حسّن هذا الوصف لمولد مواقع:\n\n${text}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5
    });

    const raw = completion.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);
    const enhanced = parsed.enhanced || text;
    const suggestions = parsed.suggestions || "";

    return {
      ok: true,
      original: text,
      enhanced,
      suggestions
    };
  } catch (err) {
    console.error("[EnhancePrompt] OpenAI error:", err);
    return {
      ok: false,
      error: "تعذر تحسين الوصف. جرّب الوصف كما هو أو صياغة أوضح.",
      original: text,
      enhanced: text
    };
  }
}

module.exports = enhancePrompt;
