/**
 * FERDOUS AI - Visual Cards System
 * NO dropdowns - ONLY visual cards with preview images
 */

// Cinematic Unsplash (fixed photos, 16:9 HD crops)
// NOTE: image URLs are intentionally explicit (no random queries).
const IMG_16x9 = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&h=675&q=80`;
const FALLBACK_16x9 = IMG_16x9("photo-1526948128573-703ee1aeb6fa"); // cinematic bokeh lights

const STYLE_IMAGES = {
  // Video + Image styles (cinematic identity per style - dark, high contrast)
  cinematic: IMG_16x9("photo-1526948128573-703ee1aeb6fa"), // moody cinema bokeh
  realistic: IMG_16x9("photo-1519681393784-d120267933ba"), // sharp dramatic portrait
  documentary: IMG_16x9("photo-1520975916090-3105956dac38"), // natgeo field
  anime: IMG_16x9("photo-1520975682031-a2ff34d1a9b4"), // neon cyberpunk
  cartoon: IMG_16x9("photo-1602524204631-2c22b7c1c7c2"), // pixar depth
  "3d_cartoon": IMG_16x9("photo-1602524204631-2c22b7c1c7c2"), // 3d depth
  fantasy: IMG_16x9("photo-1519681393784-d120267933ba"), // dramatic fantasy
  "sci-fi": IMG_16x9("photo-1462331940025-496dfbfc7564"), // space sci-fi
  digital_art: IMG_16x9("photo-1545239351-1141bd82e8a6"), // abstract neon
  business: IMG_16x9("photo-1553877522-43269d4ea984"), // premium office
  kids: IMG_16x9("photo-1503454537195-1dcabb73ffb9"), // warm kids
  animals: IMG_16x9("photo-1456926631375-92c8ce872def") // sharp wildlife
};

// Duration preset cards (each has its own 16:9 cinematic preview)
const DURATION_CARDS = [
  { value: 5, label: "5s", image: IMG_16x9("photo-1517602302552-471fe67acf66") }, // fast cut
  { value: 10, label: "10s", image: IMG_16x9("photo-1485846234645-a62644f84728") }, // dynamic scene
  { value: 30, label: "30s", image: IMG_16x9("photo-1489599849927-2ee91cede3ba") }, // cinema screen
  { value: 60, label: "1m", image: IMG_16x9("photo-1510070009289-b5bc34383727") }, // storytelling
  { value: 120, label: "2m", image: IMG_16x9("photo-1524253482453-3fed8d2fe12b") }, // short doc
  { value: 180, label: "3m", image: IMG_16x9("photo-1524253482453-3fed8d2fe12b") }, // documentary
  { value: 600, label: "10m", image: IMG_16x9("photo-1526948128573-703ee1aeb6fa") } // premium longform
];

// Language cards (each has 16:9 cinematic background + flag overlay)
const LANGUAGE_CARDS = [
  { value: "ar", label: "العربية", flag: "🇸🇦", nameEn: "Arabic", image: IMG_16x9("photo-1524492412937-b28074a5d7da") },
  { value: "he", label: "עברית", flag: "🇮🇱", nameEn: "Hebrew", image: IMG_16x9("photo-1480714378408-67cf0d13bc1b") },
  { value: "en", label: "English", flag: "🇺🇸", nameEn: "English", image: IMG_16x9("photo-1469474968028-56623f02e42e") },
  { value: "fr", label: "Français", flag: "🇫🇷", nameEn: "French", image: IMG_16x9("photo-1502602898657-3e91760cbb34") },
  { value: "de", label: "Deutsch", flag: "🇩🇪", nameEn: "German", image: IMG_16x9("photo-1467269204594-9661b134dd2b") },
  { value: "es", label: "Español", flag: "🇪🇸", nameEn: "Spanish", image: IMG_16x9("photo-1509840841025-9088ba3b0f6b") },
  { value: "it", label: "Italiano", flag: "🇮🇹", nameEn: "Italian", image: IMG_16x9("photo-1523906834658-6e24ef2386f9") },
  { value: "pt", label: "Português", flag: "🇵🇹", nameEn: "Portuguese", image: IMG_16x9("photo-1500964757637-c85e8a162699") },
  { value: "tr", label: "Türkçe", flag: "🇹🇷", nameEn: "Turkish", image: IMG_16x9("photo-1541432901042-2d8bd64b4a9b") },
  { value: "ru", label: "Русский", flag: "🇷🇺", nameEn: "Russian", image: IMG_16x9("photo-1513326738677-b964603b136d") },
  { value: "ja", label: "日本語", flag: "🇯🇵", nameEn: "Japanese", image: IMG_16x9("photo-1526481280695-3c687fd643ed") },
  { value: "ko", label: "한국어", flag: "🇰🇷", nameEn: "Korean", image: IMG_16x9("photo-1549692520-acc6669e2f0c") }
];

// Music cards (16:9 preview is mandatory)
const MUSIC_CARDS = [
  { value: "none", label: "None", icon: "🔇", image: IMG_16x9("photo-1511379938547-c1f69419868d") },
  { value: "cinematic", label: "Cinematic", icon: "🎼", image: IMG_16x9("photo-1493225457124-a3eb161ffa5f") },
  { value: "upbeat", label: "Upbeat", icon: "🎵", image: IMG_16x9("photo-1511671782779-c97d3d27a1d4") },
  { value: "lofi", label: "Lo-fi", icon: "🎧", image: IMG_16x9("photo-1493225457124-a3eb161ffa5f") }
];

// Toggle-style cards (still visual cards; UI-only helpers)
const VOICE_OVER_CARDS = [
  { value: "on", label: "Voice-over ON", icon: "🎙", image: IMG_16x9("photo-1493225457124-a3eb161ffa5f") },
  { value: "off", label: "Voice-over OFF", icon: "🔇", image: IMG_16x9("photo-1511379938547-c1f69419868d") }
];

const AUDIO_SYNC_CARDS = [
  { value: "on", label: "Auto-Sync ON", icon: "⟲", image: IMG_16x9("photo-1511671782779-c97d3d27a1d4") },
  { value: "off", label: "Auto-Sync OFF", icon: "✕", image: IMG_16x9("photo-1511379938547-c1f69419868d") }
];

// Format cards (16:9 image per format)
const FORMAT_CARDS = [
  { value: "16:9", label: "16:9", icon: "📺", desc: "YouTube", image: IMG_16x9("photo-1489599849927-2ee91cede3ba") },
  { value: "9:16", label: "9:16", icon: "📱", desc: "Reels/TikTok", image: IMG_16x9("photo-1518770660439-4636190af475") },
  { value: "1:1", label: "1:1", icon: "📷", desc: "Instagram", image: IMG_16x9("photo-1526481280695-3c687fd643ed") }
];

const PLATFORM_CARDS = [
  { value: "tiktok", label: "TikTok", icon: "♪", image: IMG_16x9("photo-1518770660439-4636190af475") },
  { value: "youtube", label: "YouTube", icon: "▶", image: IMG_16x9("photo-1489599849927-2ee91cede3ba") },
  { value: "instagram", label: "Instagram", icon: "◎", image: IMG_16x9("photo-1526481280695-3c687fd643ed") },
  { value: "facebook", label: "Facebook", icon: "f", image: IMG_16x9("photo-1611162617474-5b21e879e113") }
];

// Emotion cards (16:9 preview, no text-only)
const EMOTION_CARDS = [
  { value: "neutral", label: "Neutral", icon: "◼", image: IMG_16x9("photo-1519681393784-d120267933ba") },
  { value: "happy", label: "Happy", icon: "✦", image: IMG_16x9("photo-1500530855697-b586d89ba3ee") },
  { value: "serious", label: "Serious", icon: "▣", image: IMG_16x9("photo-1520975916090-3105956dac38") },
  { value: "energetic", label: "Energetic", icon: "⚡", image: IMG_16x9("photo-1517602302552-471fe67acf66") },
  { value: "calm", label: "Calm", icon: "◯", image: IMG_16x9("photo-1519681393784-d120267933ba") }
];

// Tone cards (16:9 preview, no text-only)
const TONE_CARDS = [
  { value: "professional", label: "Professional", icon: "PRO", image: IMG_16x9("photo-1553877522-43269d4ea984") },
  { value: "casual", label: "Casual", icon: "CAS", image: IMG_16x9("photo-1520975682031-a2ff34d1a9b4") },
  { value: "friendly", label: "Friendly", icon: "FRI", image: IMG_16x9("photo-1500530855697-b586d89ba3ee") }
];

// Website / SaaS builder layout cards (must look like real product screenshots)
const WEBSITE_LAYOUT_CARDS = [
  { value: "landing", label: "Landing Page", image: IMG_16x9("photo-1522202176988-66273c2fd55f") },
  { value: "dashboard", label: "SaaS Dashboard", image: IMG_16x9("photo-1551288049-bebda4e38f71") },
  { value: "ecommerce", label: "E-commerce", image: IMG_16x9("photo-1556742049-0cfed4f6a45d") },
  { value: "banking", label: "Banking UI", image: IMG_16x9("photo-1554224155-6726b3ff858f") }
];

// Video Intent Cards (NEW - cinematic previews for common video types)
const VIDEO_INTENT_CARDS = [
  { value: "cinematic_story", label: "Cinematic Story", image: IMG_16x9("photo-1485846234645-a62644f84728") },
  { value: "cats_animals", label: "Cats / Animals", image: IMG_16x9("photo-1456926631375-92c8ce872def") },
  { value: "body_fitness", label: "Body / Fitness", image: IMG_16x9("photo-1517602302552-471fe67acf66") },
  { value: "kids", label: "Kids", image: IMG_16x9("photo-1503454537195-1dcabb73ffb9") },
  { value: "business_ads", label: "Business / Ads", image: IMG_16x9("photo-1553877522-43269d4ea984") },
  { value: "documentary", label: "Documentary", image: IMG_16x9("photo-1520975916090-3105956dac38") }
];

// Preset cards (cinematic previews)
const PRESET_CARDS = [
  { value: "kids_cartoon", label: "Kids Cartoon Video", image: IMG_16x9("photo-1503454537195-1dcabb73ffb9") },
  { value: "cinematic_story", label: "Cinematic Story", image: IMG_16x9("photo-1485846234645-a62644f84728") },
  { value: "business_explainer", label: "Business Explainer", image: IMG_16x9("photo-1553877522-43269d4ea984") }
];

function escapeHtml(s) {
  return String(s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function wireFallbackImages(root) {
  if (!root) return;
  root.querySelectorAll("img[data-fallback]").forEach((img) => {
    img.addEventListener("error", () => {
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = "1";
      img.src = img.getAttribute("data-fallback") || FALLBACK_16x9;
    });
  });
}

function renderCinematicCards(containerId, cards, selectedValue, dataAttr, onSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = (cards || []).map((c) => {
    const isSelected = selectedValue === c.value;
    const label = c.label;
    const image = c.image || FALLBACK_16x9;
    const badge = c.icon ? `<div class="f-card-badge">${escapeHtml(c.icon)}</div>` : "";
    const check = isSelected ? `<div class="f-card-check">✓</div>` : "";
    return `
      <button type="button"
        class="f-card ${isSelected ? "selected" : ""}"
        ${dataAttr}="${escapeHtml(c.value)}"
        aria-pressed="${isSelected ? "true" : "false"}"
        onclick="${onSelect ? `(${onSelect.toString()})(${typeof c.value === "number" ? c.value : `'${String(c.value).replaceAll("'", "\\'")}'`})` : ""}">
        <div class="f-card-media">
          <img src="${escapeHtml(image)}" alt="${escapeHtml(label)}" loading="lazy" data-fallback="${escapeHtml(FALLBACK_16x9)}"/>
          <div class="f-card-vignette"></div>
          ${badge}
          ${check}
          <div class="f-card-meta">
            <div class="f-card-title">${escapeHtml(label)}</div>
          </div>
        </div>
      </button>
    `;
  }).join("");

  wireFallbackImages(container);
}

/**
 * Render visual style cards
 */
function renderStyleCards(containerId, selectedStyle, onSelect) {
  const isAr = window.__locale === "ar";
  const isVideo = containerId && containerId.includes("video");
  const styles = isVideo ? [
    // Video Studio styles (all required)
    { value: "cinematic", label: isAr ? "سينمائي" : "Cinematic", image: STYLE_IMAGES.cinematic },
    { value: "realistic", label: isAr ? "واقعي" : "Realistic", image: STYLE_IMAGES.realistic },
    { value: "documentary", label: isAr ? "وثائقي" : "Documentary", image: STYLE_IMAGES.documentary },
    { value: "cartoon", label: isAr ? "كرتون" : "Cartoon", image: STYLE_IMAGES.cartoon },
    { value: "kids", label: isAr ? "أطفال" : "Kids", image: STYLE_IMAGES.kids },
    { value: "animals", label: isAr ? "حيوانات" : "Animals", image: STYLE_IMAGES.animals },
    { value: "fantasy", label: isAr ? "خيال" : "Fantasy", image: STYLE_IMAGES.fantasy },
    { value: "sci-fi", label: isAr ? "خيال علمي" : "Sci‑Fi", image: STYLE_IMAGES["sci-fi"] }
  ] : [
    { value: "cinematic", label: isAr ? "سينمائي" : "Cinematic", image: STYLE_IMAGES.cinematic },
    { value: "realistic", label: isAr ? "واقعي" : "Realistic", image: STYLE_IMAGES.realistic },
    { value: "cartoon", label: isAr ? "كرتون" : "Cartoon", image: STYLE_IMAGES.cartoon },
    { value: "anime", label: isAr ? "أنمي" : "Anime", image: STYLE_IMAGES.anime },
    { value: "fantasy", label: isAr ? "خيال" : "Fantasy", image: STYLE_IMAGES.fantasy },
    { value: "kids", label: isAr ? "أطفال" : "Kids", image: STYLE_IMAGES.kids },
    { value: "animals", label: isAr ? "حيوانات" : "Animals", image: STYLE_IMAGES.animals },
    { value: "business", label: isAr ? "تجاري" : "Business", image: STYLE_IMAGES.business },
    { value: "digital_art", label: isAr ? "فن رقمي" : "Digital Art", image: STYLE_IMAGES.digital_art },
    { value: "3d_cartoon", label: isAr ? "كرتون 3D" : "3D Cartoon", image: STYLE_IMAGES["3d_cartoon"] }
  ];

  renderCinematicCards(containerId, styles, selectedStyle, 'data-style', onSelect);
}

/**
 * Render duration cards
 */
function renderDurationCards(containerId, selectedDuration, onSelect) {
  renderCinematicCards(containerId, DURATION_CARDS, selectedDuration, 'data-duration', onSelect);
}

/**
 * Render language cards
 */
function renderLanguageCards(containerId, selectedLang, onSelect) {
  const isAr = window.__locale === "ar";
  const cards = LANGUAGE_CARDS.map((l) => ({
    value: l.value,
    label: isAr ? `${l.flag} ${l.label}` : `${l.flag} ${l.nameEn}`,
    image: l.image || FALLBACK_16x9,
    icon: l.flag
  }));
  renderCinematicCards(containerId, cards, selectedLang, 'data-lang', onSelect);
}

/**
 * Render music cards
 */
function renderMusicCards(containerId, selectedMusic, onSelect) {
  renderCinematicCards(
    containerId,
    MUSIC_CARDS.map((m) => ({ value: m.value, label: m.label, image: m.image, icon: m.icon })),
    selectedMusic,
    'data-music',
    onSelect
  );
}

/**
 * Render format cards
 */
function renderFormatCards(containerId, selectedFormat, onSelect) {
  renderCinematicCards(
    containerId,
    FORMAT_CARDS.map((f) => ({ value: f.value, label: `${f.label} · ${f.desc}`, image: f.image, icon: f.icon })),
    selectedFormat,
    'data-format',
    onSelect
  );
}

/**
 * Render platform cards
 */
function renderPlatformCards(containerId, selectedPlatform, onSelect) {
  renderCinematicCards(
    containerId,
    PLATFORM_CARDS.map((p) => ({ value: p.value, label: p.label, image: p.image, icon: p.icon })),
    selectedPlatform,
    'data-platform',
    onSelect
  );
}

function renderEmotionCards(containerId, selected, onSelect) {
  renderCinematicCards(
    containerId,
    EMOTION_CARDS.map((e) => ({ value: e.value, label: e.label, image: e.image, icon: e.icon })),
    selected,
    'data-emotion',
    onSelect
  );
}

function renderToneCards(containerId, selected, onSelect) {
  renderCinematicCards(
    containerId,
    TONE_CARDS.map((t) => ({ value: t.value, label: t.label, image: t.image, icon: t.icon })),
    selected,
    'data-tone',
    onSelect
  );
}

function renderWebsiteLayoutCards(containerId, selected, onSelect) {
  renderCinematicCards(containerId, WEBSITE_LAYOUT_CARDS, selected, 'data-layout', onSelect);
}

function renderPresetCards(containerId, selected, onSelect) {
  renderCinematicCards(containerId, PRESET_CARDS, selected, 'data-preset', onSelect);
}

function renderVideoIntentCards(containerId, selected, onSelect) {
  renderCinematicCards(containerId, VIDEO_INTENT_CARDS, selected, 'data-intent', onSelect);
}

function renderVoiceOverCards(containerId, selected, onSelect) {
  const isAr = window.__locale === "ar";
  const cards = VOICE_OVER_CARDS.map((c) => ({
    value: c.value,
    label: isAr ? (c.value === "on" ? "تعليق صوتي: تشغيل" : "تعليق صوتي: إيقاف") : c.label,
    image: c.image,
    icon: c.icon
  }));
  renderCinematicCards(containerId, cards, selected, "data-voiceover", onSelect);
}

function renderAudioSyncCards(containerId, selected, onSelect) {
  const isAr = window.__locale === "ar";
  const cards = AUDIO_SYNC_CARDS.map((c) => ({
    value: c.value,
    label: isAr ? (c.value === "on" ? "مزامنة تلقائية: تشغيل" : "مزامنة تلقائية: إيقاف") : c.label,
    image: c.image,
    icon: c.icon
  }));
  renderCinematicCards(containerId, cards, selected, "data-audiosync", onSelect);
}

// Export for use in generate.html
window.FERDOUS_CARDS = {
  renderStyleCards,
  renderDurationCards,
  renderLanguageCards,
  renderMusicCards,
  renderVoiceOverCards,
  renderAudioSyncCards,
  renderFormatCards,
  renderPlatformCards,
  renderEmotionCards,
  renderToneCards,
  renderWebsiteLayoutCards,
  renderPresetCards,
  renderVideoIntentCards,
  STYLE_IMAGES,
  DURATION_CARDS,
  LANGUAGE_CARDS,
  MUSIC_CARDS,
  VOICE_OVER_CARDS,
  AUDIO_SYNC_CARDS,
  FORMAT_CARDS,
  PLATFORM_CARDS,
  EMOTION_CARDS,
  TONE_CARDS,
  WEBSITE_LAYOUT_CARDS,
  PRESET_CARDS,
  VIDEO_INTENT_CARDS,
  FALLBACK_16x9
};
