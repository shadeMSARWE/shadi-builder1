/**
 * FERDOUS AI - Visual Cards System
 * NO dropdowns - ONLY visual cards with preview images
 */

// Style preview images (using Unsplash/placeholder)
const STYLE_IMAGES = {
  realistic: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=200&h=200&fit=crop",
  cinematic: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&h=200&fit=crop",
  "3d_cartoon": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop",
  anime: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&h=200&fit=crop",
  digital_art: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop",
  cartoon: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop",
  fantasy: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=200&h=200&fit=crop",
  "sci-fi": "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=200&h=200&fit=crop",
  business: "https://images.unsplash.com/photo-1486312338219-ce68e2c6f44d?w=200&h=200&fit=crop",
  kids: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop",
  animals: "https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=200&h=200&fit=crop",
  documentary: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&h=200&fit=crop"
};

// Duration preset cards
const DURATION_CARDS = [
  { value: 5, label: "5s", icon: "⚡", color: "from-purple-500 to-pink-500" },
  { value: 15, label: "15s", icon: "🎬", color: "from-blue-500 to-cyan-500" },
  { value: 30, label: "30s", icon: "🎥", color: "from-indigo-500 to-purple-500" },
  { value: 60, label: "1m", icon: "⏱️", color: "from-emerald-500 to-teal-500" },
  { value: 180, label: "3m", icon: "📹", color: "from-orange-500 to-red-500" },
  { value: 600, label: "10m", icon: "🎞️", color: "from-rose-500 to-pink-500" }
];

// Language cards
const LANGUAGE_CARDS = [
  { value: "ar", label: "العربية", flag: "🇸🇦", nameEn: "Arabic" },
  { value: "he", label: "עברית", flag: "🇮🇱", nameEn: "Hebrew" },
  { value: "en", label: "English", flag: "🇺🇸", nameEn: "English" },
  { value: "fr", label: "Français", flag: "🇫🇷", nameEn: "French" },
  { value: "de", label: "Deutsch", flag: "🇩🇪", nameEn: "German" },
  { value: "es", label: "Español", flag: "🇪🇸", nameEn: "Spanish" },
  { value: "it", label: "Italiano", flag: "🇮🇹", nameEn: "Italian" },
  { value: "pt", label: "Português", flag: "🇵🇹", nameEn: "Portuguese" },
  { value: "tr", label: "Türkçe", flag: "🇹🇷", nameEn: "Turkish" },
  { value: "ru", label: "Русский", flag: "🇷🇺", nameEn: "Russian" },
  { value: "ja", label: "日本語", flag: "🇯🇵", nameEn: "Japanese" },
  { value: "ko", label: "한국어", flag: "🇰🇷", nameEn: "Korean" }
];

// Music cards
const MUSIC_CARDS = [
  { value: "none", label: "None", icon: "🔇", color: "bg-slate-700" },
  { value: "cinematic", label: "Cinematic", icon: "🎼", color: "bg-purple-600", preview: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop" },
  { value: "upbeat", label: "Upbeat", icon: "🎵", color: "bg-yellow-600", preview: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop" },
  { value: "lofi", label: "Lo-fi", icon: "🎧", color: "bg-indigo-600", preview: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop" }
];

// Format cards
const FORMAT_CARDS = [
  { value: "16:9", label: "16:9", icon: "📺", desc: "YouTube", aspect: "aspect-video" },
  { value: "9:16", label: "9:16", icon: "📱", desc: "Reels/TikTok", aspect: "aspect-[9/16]" },
  { value: "1:1", label: "1:1", icon: "📷", desc: "Instagram", aspect: "aspect-square" }
];

// Platform cards
const PLATFORM_CARDS = [
  { value: "instagram", label: "Instagram", icon: "📷", color: "from-purple-500 to-pink-500", preview: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop" },
  { value: "tiktok", label: "TikTok", icon: "🎵", color: "from-black to-gray-800", preview: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop" },
  { value: "youtube", label: "YouTube", icon: "▶️", color: "from-red-500 to-red-700", preview: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop" },
  { value: "facebook", label: "Facebook", icon: "👥", color: "from-blue-500 to-blue-700", preview: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop" }
];

// Emotion cards
const EMOTION_CARDS = [
  { value: "neutral", label: "Neutral", icon: "😐", color: "bg-slate-600" },
  { value: "happy", label: "Happy", icon: "😊", color: "bg-yellow-500" },
  { value: "serious", label: "Serious", icon: "😐", color: "bg-gray-700" },
  { value: "energetic", label: "Energetic", icon: "⚡", color: "bg-orange-500" }
];

// Tone cards
const TONE_CARDS = [
  { value: "professional", label: "Professional", icon: "💼", color: "bg-blue-600" },
  { value: "casual", label: "Casual", icon: "👕", color: "bg-green-600" },
  { value: "friendly", label: "Friendly", icon: "🤝", color: "bg-pink-600" }
];

/**
 * Render visual style cards
 */
function renderStyleCards(containerId, selectedStyle, onSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const styles = [
    { id: "realistic", name: "Realistic", nameAr: "واقعي" },
    { id: "cinematic", name: "Cinematic", nameAr: "سينمائي" },
    { id: "3d_cartoon", name: "3D Cartoon", nameAr: "كرتون 3D" },
    { id: "anime", name: "Anime", nameAr: "أنمي" },
    { id: "digital_art", name: "Digital Art", nameAr: "فن رقمي" },
    { id: "cartoon", name: "Cartoon", nameAr: "كرتون" },
    { id: "fantasy", name: "Fantasy", nameAr: "خيال" },
    { id: "sci-fi", name: "Sci-Fi", nameAr: "خيال علمي" },
    { id: "business", name: "Business", nameAr: "تجاري" },
    { id: "kids", name: "Kids", nameAr: "أطفال" },
    { id: "animals", name: "Animals", nameAr: "حيوانات" },
    { id: "documentary", name: "Documentary", nameAr: "وثائقي" }
  ];
  
  container.innerHTML = styles.map(style => {
    const isSelected = selectedStyle === style.id;
    const img = STYLE_IMAGES[style.id] || STYLE_IMAGES.realistic;
    return `
      <button type="button" 
        class="visual-card ${isSelected ? 'selected' : ''}" 
        data-style="${style.id}"
        onclick="${onSelect ? `(${onSelect.toString()})('${style.id}')` : ''}">
        <div class="visual-card-image">
          <img src="${img}" alt="${style.name}" loading="lazy" />
          ${isSelected ? '<div class="visual-card-check">✓</div>' : ''}
        </div>
        <div class="visual-card-label">${window.__locale === 'ar' ? style.nameAr : style.name}</div>
      </button>
    `;
  }).join("");
}

/**
 * Render duration cards
 */
function renderDurationCards(containerId, selectedDuration, onSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = DURATION_CARDS.map(dur => {
    const isSelected = selectedDuration === dur.value;
    return `
      <button type="button" 
        class="duration-card ${isSelected ? 'selected' : ''}" 
        data-duration="${dur.value}"
        onclick="${onSelect ? `(${onSelect.toString()})(${dur.value})` : ''}">
        <div class="duration-card-icon">${dur.icon}</div>
        <div class="duration-card-label">${dur.label}</div>
      </button>
    `;
  }).join("");
}

/**
 * Render language cards
 */
function renderLanguageCards(containerId, selectedLang, onSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = LANGUAGE_CARDS.map(lang => {
    const isSelected = selectedLang === lang.value;
    const label = window.__locale === 'ar' ? lang.label : lang.nameEn;
    return `
      <button type="button" 
        class="language-card ${isSelected ? 'selected' : ''}" 
        data-lang="${lang.value}"
        onclick="${onSelect ? `(${onSelect.toString()})('${lang.value}')` : ''}">
        <div class="language-card-flag">${lang.flag}</div>
        <div class="language-card-label">${label}</div>
      </button>
    `;
  }).join("");
}

/**
 * Render music cards
 */
function renderMusicCards(containerId, selectedMusic, onSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = MUSIC_CARDS.map(music => {
    const isSelected = selectedMusic === music.value;
    return `
      <button type="button" 
        class="music-card ${isSelected ? 'selected' : ''}" 
        data-music="${music.value}"
        onclick="${onSelect ? `(${onSelect.toString()})('${music.value}')` : ''}">
        ${music.preview ? `<div class="music-card-image"><img src="${music.preview}" alt="${music.label}" /></div>` : ''}
        <div class="music-card-icon">${music.icon}</div>
        <div class="music-card-label">${music.label}</div>
      </button>
    `;
  }).join("");
}

/**
 * Render format cards
 */
function renderFormatCards(containerId, selectedFormat, onSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = FORMAT_CARDS.map(format => {
    const isSelected = selectedFormat === format.value;
    return `
      <button type="button" 
        class="format-card ${isSelected ? 'selected' : ''}" 
        data-format="${format.value}"
        onclick="${onSelect ? `(${onSelect.toString()})('${format.value}')` : ''}">
        <div class="format-card-icon">${format.icon}</div>
        <div class="format-card-label">${format.label}</div>
        <div class="format-card-desc">${format.desc}</div>
      </button>
    `;
  }).join("");
}

/**
 * Render platform cards
 */
function renderPlatformCards(containerId, selectedPlatform, onSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = PLATFORM_CARDS.map(platform => {
    const isSelected = selectedPlatform === platform.value;
    return `
      <button type="button" 
        class="platform-card ${isSelected ? 'selected' : ''}" 
        data-platform="${platform.value}"
        onclick="${onSelect ? `(${onSelect.toString()})('${platform.value}')` : ''}">
        <div class="platform-card-image">
          <img src="${platform.preview}" alt="${platform.label}" />
          ${isSelected ? '<div class="platform-card-check">✓</div>' : ''}
        </div>
        <div class="platform-card-icon">${platform.icon}</div>
        <div class="platform-card-label">${platform.label}</div>
      </button>
    `;
  }).join("");
}

// Export for use in generate.html
window.FERDOUS_CARDS = {
  renderStyleCards,
  renderDurationCards,
  renderLanguageCards,
  renderMusicCards,
  renderFormatCards,
  renderPlatformCards,
  STYLE_IMAGES,
  DURATION_CARDS,
  LANGUAGE_CARDS,
  MUSIC_CARDS,
  FORMAT_CARDS,
  PLATFORM_CARDS,
  EMOTION_CARDS,
  TONE_CARDS
};
