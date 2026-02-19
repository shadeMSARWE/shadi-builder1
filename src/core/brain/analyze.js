module.exports = async (description) => {
  const desc = description.toLowerCase();
  
  // 1. تحديد نوع الموقع والصفحات المطلوبة ذكياً
  let pages = ["index.html"]; // الصفحة الأساسية دائماً موجودة
  let category = "general";

  if (desc.includes("bank") || desc.includes("بنك") || desc.includes("finance")) {
    pages = ["index.html", "dashboard.html", "transfer.html", "login.html"];
    category = "finance,banking,money";
  } else if (desc.includes("saas") || desc.includes("app") || desc.includes("software")) {
    pages = ["index.html", "pricing.html", "dashboard.html", "signup.html"];
    category = "technology,software,abstract";
  } else if (desc.includes("restaurant") || desc.includes("مطعم")) {
    pages = ["index.html", "menu.html", "reservation.html"];
    category = "food,restaurant,chef";
  }

  // 2. تحليل الأقسام بناءً على الوصف
  let sections = ["Navbar", "Hero", "Features"];
  if (desc.includes("contact") || desc.includes("تواصل")) sections.push("Contact");
  sections.push("Footer");

  return {
    title: description.split(" ").slice(0, 5).join(" ") || "AI Generated Project",
    pages: pages,
    category: category, // هاد رح نستخدمه في htmlBuilder عشان نجيب صور Unsplash حقيقية
    sections: sections,
    theme: "dark",
    isPremium: desc.includes("احترافي") || desc.includes("premium")
  };
};