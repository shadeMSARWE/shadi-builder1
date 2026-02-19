const fs = require("fs");
const path = require("path");
const { PLANS } = require("./plans");

const file = path.join(__dirname, "../../../data/users.json");

// تأكيد وجود مجلد data
if (!fs.existsSync(path.dirname(file))) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

// قراءة / كتابة
const read = () =>
  fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};

const write = (data) =>
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

/* =========================
   GET USER (Auto Create)
========================= */
exports.getUser = (id) => {
  const users = read();

  if (!users[id]) {
    users[id] = {
      id,
      plan: "free",
      usage: 0,
      projects_count: 0,
      created_at: Date.now(),
    };
    write(users);
  }

  return users[id];
};

/* =========================
   CAN GENERATE (PLAN LIMIT)
========================= */
exports.canGenerate = (id) => {
  const user = exports.getUser(id);
  const plan = PLANS[user.plan] || PLANS.free;
  return user.usage < plan.maxGenerations;
};

/* =========================
   INCREMENT USAGE
========================= */
exports.incrementUsage = (id) => {
  const users = read();
  if (!users[id]) return;

  users[id].usage += 1;
  write(users);
};

/* =========================
   PROJECT COUNTER
========================= */
exports.incrementProjects = (id) => {
  const users = read();
  if (!users[id]) return;

  users[id].projects_count += 1;
  write(users);
};

/* =========================
   UPGRADE USER → PRO
========================= */
exports.upgradeUser = (id) => {
  const users = read();
  if (!users[id]) return;

  users[id].plan = "pro";
  write(users);
};
