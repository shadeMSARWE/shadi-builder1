module.exports = async (analysis) => {
  // هاد الملف هو الجسر اللي بينقل البيانات من التحليل للمصنع
  return {
    title: analysis.title,
    sections: analysis.sections,
    category: analysis.category, // ضروري جداً عشان صور Unsplash تشتغل
    theme: analysis.theme || "dark",
    isPremium: analysis.isPremium || false
  };
};