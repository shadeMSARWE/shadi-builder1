const PLANS = {
  free: {
    name: "Free",
    maxProjects: 2, // زدتها شوي عشان المستخدم يتشجع
    maxGenerations: 3,
    features: ["Standard Templates", "Community Support"]
  },
  pro: {
    name: "Pro",
    maxProjects: 100,
    maxGenerations: 9999,
    features: ["Manus Engine", "Custom Domains", "Priority AI"]
  }
};

/**
 * فحص هل المستخدم مسموح له ينشئ مشروع جديد
 * @param {Object} user - كائن المستخدم من قاعدة البيانات
 */
function canCreateProject(user) {
  // التأكد من وجود مستخدم وخطة، إذا لا نعتبره Free
  const planKey = user.plan || "free";
  const plan = PLANS[planKey];
  
  return user.projects_count < plan.maxProjects;
}

/**
 * فحص هل مسموح له يولد كود AI
 * @param {Object} user - كائن المستخدم
 */
function canGenerate(user) {
  const planKey = user.plan || "free";
  const plan = PLANS[planKey];
  
  return user.usage < plan.maxGenerations;
}

/**
 * جلب معلومات الخطة الحالية للمستخدم
 */
function getPlanInfo(planKey = "free") {
  return PLANS[planKey] || PLANS.free;
}

/**
 * وظيفة مساعدة لتحديث الاستهلاك (بكرة بنربطها بالـ DB)
 */
function incrementUsage(user) {
    user.usage += 1;
    // هنا بكرة بنضيف كود: await db.users.update(...)
}

module.exports = {
  PLANS,
  canCreateProject,
  canGenerate,
  getPlanInfo,
  incrementUsage
};