# FERDOUS AI - System Architecture

## Overview
FERDOUS AI is the Ultimate AI Operating System - a market-dominating, all-in-one AI platform that understands intent and executes everything automatically.

## Core Philosophy
**User describes → AI understands → AI decides → AI executes**

The system does NOT ask users to configure tools. It UNDERSTANDS INTENT and auto-selects everything.

## System Architecture

### 1️⃣ FERDOUS BRAIN (Intent Engine)
**Location:** `src/core/ferdous/brain.js`

**Purpose:** Understands natural language intent and creates execution plans.

**Key Functions:**
- `understandIntent(userPrompt, userLanguage)` - Analyzes prompt and returns structured execution plan
- `applyPreset(presetId, basePrompt)` - Applies Quick Start Presets

**Output Format:**
```json
{
  "intent": "description",
  "outputType": "image|video|website|saas|social|multi",
  "outputs": [
    {
      "type": "website",
      "studio": "website",
      "config": { "style", "duration", "format", "voiceLanguage", ... },
      "prompt": "enhanced prompt"
    }
  ],
  "preset": "kids_cartoon|cinematic_story|business_explainer|none",
  "estimatedCredits": 50,
  "reasoning": "explanation"
}
```

### 2️⃣ STUDIOS (Execution Engines)
**Location:** `src/core/studios/`

Each studio works independently and via the Brain:

- **Image Studio** (`image.js`) - Text → Image
- **Video Studio** (`video.js`) - Text → Video | Image → Video
- **Website Studio** (`website.js`) - Text → Website/SaaS
- **Social Studio** (`social.js`) - Social posts (text + image + video)
- **Audio Studio** (`audio.js`) - Voice generation, multi-language

### 3️⃣ AI RECOMMENDATION ENGINE
**Location:** `src/core/ferdous/recommendation.js`

**Purpose:** Analyzes generated output and suggests improvements.

**Key Functions:**
- `analyzeAndRecommend(outputType, content, prompt, language)` - Returns recommendations
- `autoImprove(outputType, content, recommendations, language)` - Applies improvements automatically

**Recommendation Types:**
- Missing sections (CTA, pricing, testimonials)
- UX/UI improvements
- Conversion optimization
- SEO gaps
- Content quality

### 4️⃣ MULTI-OUTPUT ORCHESTRATION
**Location:** `src/core/ferdous/orchestrator.js`

**Purpose:** Executes multiple outputs from a single prompt.

**Function:**
- `executePlan(userId, executionPlan, userLanguage)` - Runs all outputs in parallel

## API Endpoints

### Unified Generation
```
POST /api/v1/ferdous/generate
Body: { prompt, preset?, language? }
Returns: { ok, plan, results[], recommendations?, totalCreditsUsed }
```

### Auto-Improve
```
POST /api/v1/ferdous/auto-improve
Body: { outputType, content, recommendations, language? }
Returns: { ok, improved, appliedRecommendations[] }
```

### Get Recommendations
```
POST /api/v1/ferdous/recommend
Body: { outputType, content, prompt, language? }
Returns: { ok, recommendations[], autoImproveAvailable, missingParts[] }
```

### Quick Start Presets
```
GET /api/v1/ferdous/presets
Returns: { ok, presets[] }
```

### i18n Strings
```
GET /api/v1/ferdous/i18n/:lang
Returns: { ok, lang, direction, strings }
```

## Frontend Architecture

### Main Interface (`generate.html`)
- **5 Tabs:** Website, Video, Image, Social, Audio
- **Quick Start Presets:** Kids Cartoon, Cinematic Story, Business Explainer
- **Recommendation Panel:** Shows AI suggestions with Auto-Improve button
- **Live Editor:** Direct editing of generated websites in iframe
- **Multi-language:** Arabic (RTL), Hebrew (RTL), English (LTR)

### i18n System
**Location:** `src/core/i18n/` and `src/public/i18n.js`

- Centralized strings for all languages
- Auto RTL/LTR switching
- Language saved per user (localStorage + Supabase)

## Quick Start Presets

1. **Kids Cartoon Video** - 20s, 3D Cartoon, Upbeat music, Arabic VO
2. **Cinematic Story** - 30s, Cinematic, Cinematic music, Arabic VO
3. **Business Explainer** - 30s, Realistic, No music, Arabic VO

## Credits System

- New users: 500 free credits (Supabase)
- Deduction by complexity:
  - Website: 10 credits
  - Image: 5 credits
  - Video: Dynamic (duration + style + audio)
  - Social: 8 credits (+ image/video if included)
  - Audio: 15 credits/minute

## File Structure

```
src/
├── core/
│   ├── ferdous/
│   │   ├── brain.js          # Intent Engine
│   │   ├── recommendation.js # AI Recommendations
│   │   └── orchestrator.js   # Multi-output execution
│   ├── studios/
│   │   ├── image.js
│   │   ├── video.js
│   │   ├── website.js
│   │   ├── social.js
│   │   └── audio.js
│   └── i18n/
│       ├── strings.js        # All translations
│       └── service.js        # i18n utilities
├── routes/
│   └── ferdous.routes.js     # Unified API
└── public/
    ├── generate.html         # Main interface
    └── i18n.js              # Frontend i18n
```

## Next Steps (Integration)

1. **Connect Image Generation:** DALL-E, Stable Diffusion API
2. **Connect Video Generation:** Runway, Pika API
3. **Connect Audio Generation:** ElevenLabs API
4. **Enhance Recommendations:** More sophisticated analysis
5. **Add More Presets:** Expand Quick Start options

## Deployment

- Health check: `/health`
- Environment variables: `OPENAI_API_KEY`, `SUPABASE_*`, `PAYPAL_*`
- Railway-ready with proper logging

---

**FERDOUS AI** - The Ultimate AI Operating System
*One brain. Many powers. Zero friction. Extreme luxury.*
