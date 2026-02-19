# FERDOUS AI - Visual Cards System

## Overview
All dropdowns have been replaced with **visual cards** featuring preview images. NO text dropdowns exist in the UI.

## Visual Cards Implemented

### Video Studio
- ✅ **Duration Cards** (5s, 15s, 30s, 1m, 3m, 10m) - Visual icons
- ✅ **Style Cards** (12 styles) - Preview images from Unsplash
- ✅ **Language Cards** (12 languages) - Flag emojis
- ✅ **Music Cards** (4 options) - Preview images + icons
- ✅ **Format Cards** (16:9, 9:16, 1:1) - Icons + descriptions

### Image Studio
- ✅ **Style Cards** (12 styles) - Preview images

### Social Studio
- ✅ **Platform Cards** (Instagram, TikTok, YouTube, Facebook) - Preview images + icons

### Audio Studio
- ✅ **Language Cards** (12 languages) - Flag emojis
- ✅ **Emotion Cards** (Neutral, Happy, Serious, Energetic) - Emoji icons
- ✅ **Tone Cards** (Professional, Casual, Friendly) - Emoji icons

## File Structure

- `src/public/ferdous-cards.js` - Visual cards rendering system
- `src/public/generate.html` - Updated UI with all visual cards

## CSS Classes

- `.visual-card` - Style selection cards
- `.duration-card` - Duration preset cards
- `.language-card` - Language selection cards
- `.music-card` - Background music cards
- `.format-card` - Aspect ratio cards
- `.platform-card` - Social platform cards
- `.emotion-card` - Voice emotion cards
- `.tone-card` - Voice tone cards

All cards support:
- `.selected` state (highlighted border + background)
- Hover effects (transform + border color change)
- Responsive grid layout

## State Management

Visual cards update global state objects:
- `videoState` - { duration, style, voiceLang, bgMusic, format }
- `imageState` - { style }
- `audioState` - { lang, emotion, tone }
- `socialState` - { platform }

## Initialization

Cards are initialized on `DOMContentLoaded` via `initVisualCards()` function, which:
1. Waits for `FERDOUS_CARDS` to load
2. Renders all card containers
3. Sets up click handlers
4. Applies selected states

Cards are re-initialized when switching tabs to ensure visibility.

## Preview Images

All style/preview images use Unsplash URLs with consistent sizing (200x200, fit=crop).

---

**FERDOUS AI** - Visual-first, zero dropdowns, luxury experience.
