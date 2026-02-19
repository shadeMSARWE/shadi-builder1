# FERDOUS AI OS - Production Architecture

## Folder Structure

```
/core
  auth/          - getUserFromToken, extractBearerToken
  credits/       - getCredits, deductCredits, canAfford, logUsage
  jobs/          - enqueue, processQueue (async job queue)
  storage/       - writeFiles, getProjectPath, GENERATED paths
  database/      - createProject, getProjectsByUser
  ai/            - chatJson (OpenAI wrapper)
  queue/         - re-export jobs

/engines
  website/       - WEBSITE_ENGINE_PRO (controller, schema, prompts, file-generator)
  store/         - eCommerce (products, cart, checkout)
  saas/          - Landing, dashboard, pricing
  app/           - React Native scaffold
  game/          - 2D/3D scaffold
  video/         - Script, scenes, SRT
  image/         - Config for DALL-E/SD
  voice/         - TTS config
  social/        - Hooks, captions, hashtags
  advanced/      - Prompt enhancer
  loader.ts      - Registers all engines

/api
  generate/      - POST (central orchestration)
  website/generate/
  store/generate/
  credits/       - GET
  projects/      - GET
  export/[projectId]/ - GET (ZIP)
  i18n/[lang]/   - GET

/generated (public/generated/)
  websites/
  stores/
  saas/
  apps/
  games/
  videos/
  images/
  voices/
  social/
  advanced/

/ui
  layouts/DashboardLayout.tsx
  dashboard/EnginePanel.tsx

/system
  orchestrator.ts - orchestrate()
  router.ts      - route(prompt) -> engineId
  registry.ts    - register, get, list
```

## Engine Flow

1. User prompt → Router detects engine
2. Orchestrator checks credits, calls engine
3. Engine: AI → structured JSON → validate → file generator
4. Files written to public/generated/{engine}/{projectId}/
5. Project metadata saved to Supabase
6. Credits deducted, usage logged

## i18n

- Arabic (RTL), Hebrew (RTL), English (LTR)
- /api/i18n/[lang] returns strings
- lib/i18n/strings.ts

## Run

```bash
npm install
npm run dev
```

Set .env with Supabase + OpenAI keys. Run supabase/schema.sql.
