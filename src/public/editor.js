// ===============================
// FERDOUS AI – Project Editor (MVP)
// ===============================

let pages = [
  {
    id: "home",
    name: "Home",
    sections: ["Hero", "Features", "CTA"]
  }
];

let currentPage = pages[0];

/* Render Pages Sidebar */
function renderPages() {
  document.getElementById("pages").innerHTML =
    pages.map(p => `
      <div
        onclick="selectPage('${p.id}')"
        class="px-4 py-2 rounded-xl cursor-pointer
        ${p.id === currentPage.id ? "bg-indigo-600" : "hover:bg-slate-800"}">
        ${p.name}
      </div>
    `).join("");
}

/* Render Sections */
function renderSections() {
  document.getElementById("sections").innerHTML =
    currentPage.sections.map(s => `
      <div class="px-3 py-2 rounded-lg bg-slate-800 text-sm">
        ${s}
      </div>
    `).join("");
}

/* Select Page */
function selectPage(id) {
  currentPage = pages.find(p => p.id === id);
  document.getElementById("currentPage").innerText = currentPage.name;
  renderPages();
  renderSections();
}

/* Add New Page */
function addPage() {
  const name = prompt("اسم الصفحة الجديدة:");
  if (!name) return;

  const id = name.toLowerCase().replace(/\s+/g, "-");
  pages.push({
    id,
    name,
    sections: ["Hero"]
  });

  selectPage(id);
}

/* Preview (placeholder) */
function preview() {
  alert("🔥 الخطوة الجاية: Live Preview حقيقي");
}

/* Logout */
function logout() {
  localStorage.clear();
  location.href = "/";
}

/* Init */
renderPages();
renderSections();
