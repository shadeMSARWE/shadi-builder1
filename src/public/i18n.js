/**
 * FERDOUS AI - Frontend i18n (ar/he/en)
 * Loads from backend /api/v1/ferdous/i18n/:lang for consistency
 * Falls back to local strings if API fails
 */
window.__locale = window.__locale || localStorage.getItem("lang") || "ar";
window.__strings = {
  ar: {
    appName: "فردوس AI",
    tagline: "نظام التشغيل الذكي الشامل",
    credits: "النقاط",
    creditsHint: "10/موقع",
    history: "سجل المشاريع",
    noHistory: "لا توجد مشاريع بعد",
    preview: "معاينة مباشرة",
    download: "تحميل ZIP",
    logout: "تسجيل خروج",
    topUp: "شحن النقاط",
    tabWebsite: "إنشاء موقع",
    tabVideo: "إنشاء فيديو",
    tabImage: "إنشاء صورة",
    tabSocial: "محتوى اجتماعي",
    tabAudio: "صوت",
    promptPlaceholder: "اشرح فكرتك... مثال: موقع بنك إلكتروني عصري",
    enhance: "تحسين الوصف",
    enhancing: "جاري التحسين...",
    generate: "ابدأ التوليد",
    generating: "جاري التوليد...",
    statusReady: "جاهز",
    statusAnalyzing: "تحليل الفكرة...",
    statusDesigning: "جاري التصميم...",
    statusBuilding: "بناء الكود...",
    statusFinal: "اللمسات النهائية...",
    duration: "المدة",
    style: "الأسلوب البصري",
    voiceOver: "تعليق صوتي AI",
    voiceLanguage: "لغة الصوت",
    bgMusic: "موسيقى خلفية",
    autoSync: "مزامنة صوتية تلقائية",
    format: "نسبة العرض",
    recommendations: "اقتراحات للتحسين",
    autoImprove: "تحسين تلقائي",
    generateMissing: "إنشاء الأجزاء الناقصة",
    errorPrompt: "أدخل وصفاً أولاً",
    errorNoCredits: "نقاطك غير كافية",
    presetKids: "فيديو كرتون للأطفال",
    presetCinematic: "قصة سينمائية",
    presetBusiness: "شرح تجاري",
    suggestion: "اقتراحنا",
    newProject: "مشروع جديد",
    openPreview: "فتح المعاينة"
  },
  he: {
    appName: "פרדוס AI",
    tagline: "מערכת ההפעלה החכמה המקיפה",
    credits: "נקודות",
    creditsHint: "10/אתר",
    history: "היסטוריית פרויקטים",
    noHistory: "אין פרויקטים עדיין",
    preview: "תצוגה מקדימה",
    download: "הורד ZIP",
    logout: "התנתק",
    topUp: "טען נקודות",
    tabWebsite: "צור אתר",
    tabVideo: "צור וידאו",
    tabImage: "צור תמונה",
    tabSocial: "תוכן חברתי",
    tabAudio: "אודיו",
    promptPlaceholder: "תאר את הרעיון שלך...",
    enhance: "שפר תיאור",
    enhancing: "משפר...",
    generate: "התחל יצירה",
    generating: "יוצר...",
    statusReady: "מוכן",
    statusAnalyzing: "מנתח...",
    statusDesigning: "מעצב...",
    statusBuilding: "בונה...",
    statusFinal: "מגעים אחרונים...",
    duration: "משך",
    style: "סגנון ויזואלי",
    voiceOver: "קריינות AI",
    voiceLanguage: "שפת קול",
    bgMusic: "מוזיקת רקע",
    autoSync: "סנכרון אוטומטי",
    format: "יחס גובה-רוחב",
    recommendations: "המלצות לשיפור",
    autoImprove: "שיפור אוטומטי",
    generateMissing: "צור חלקים חסרים",
    errorPrompt: "הזן תיאור תחילה",
    errorNoCredits: "אין מספיק נקודות",
    presetKids: "וידאו קריקטורה לילדים",
    presetCinematic: "סיפור קולנועי",
    presetBusiness: "הסבר עסקי",
    suggestion: "הצעה",
    newProject: "פרויקט חדש",
    openPreview: "פתח תצוגה מקדימה"
  },
  en: {
    appName: "FERDOUS AI",
    tagline: "The Ultimate AI Operating System",
    credits: "Credits",
    creditsHint: "10/site",
    history: "Project History",
    noHistory: "No projects yet",
    preview: "Live Preview",
    download: "Download ZIP",
    logout: "Log out",
    topUp: "Top Up",
    tabWebsite: "Website Builder",
    tabVideo: "Video Generator",
    tabImage: "Image Generator",
    tabSocial: "Social Content",
    tabAudio: "Audio",
    promptPlaceholder: "Describe your idea... e.g. Modern banking website",
    enhance: "Enhance Prompt",
    enhancing: "Enhancing...",
    generate: "Generate",
    generating: "Generating...",
    statusReady: "Ready",
    statusAnalyzing: "Analyzing...",
    statusDesigning: "Designing...",
    statusBuilding: "Building...",
    statusFinal: "Final touches...",
    duration: "Duration",
    style: "Visual Style",
    voiceOver: "AI Voice-over",
    voiceLanguage: "Voice Language",
    bgMusic: "Background Music",
    autoSync: "Auto Audio Sync",
    format: "Aspect Ratio",
    recommendations: "Improvement Suggestions",
    autoImprove: "Auto Improve",
    generateMissing: "Generate Missing Parts",
    errorPrompt: "Enter a description first",
    errorNoCredits: "Not enough credits",
    presetKids: "Kids Cartoon Video",
    presetCinematic: "Cinematic Story",
    presetBusiness: "Business Explainer",
    suggestion: "Suggestion",
    newProject: "New project",
    openPreview: "Open preview"
  }
};

window.__t = function (key) {
  var s = window.__strings[window.__locale];
  return (s && s[key]) || key;
};

// Try to load from backend on init (optional enhancement)
(function() {
  var lang = window.__locale || "ar";
  fetch("/api/v1/ferdous/i18n/" + lang)
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (d.ok && d.strings) {
        window.__strings[lang] = Object.assign(window.__strings[lang] || {}, d.strings);
        if (d.direction) {
          document.documentElement.dir = d.direction;
          document.documentElement.lang = d.lang;
        }
      }
    })
    .catch(function() {});
})();
