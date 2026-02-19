# FERDOUS AI - Project Structure

```
ferdous-ai/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   ├── generate/      # Central generation
│   │   ├── tools/        # Module list
│   │   ├── projects/     # Project CRUD
│   │   ├── credits/      # Credit balance
│   │   └── export/       # ZIP download
│   ├── dashboard/
│   ├── login/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── core/                   # FERDOUS Core Engine
│   ├── engine/
│   │   └── orchestrator.ts  # Central orchestrator
│   └── types/
│       └── index.ts
├── modules/                # 10 independent sections
│   ├── website/           # Website Builder (implemented)
│   ├── store/             # Online Store
│   ├── app/               # App Builder
│   ├── saas/              # SaaS Builder
│   ├── game/              # Game Builder
│   ├── video/             # Video Generator
│   ├── image/             # Image Lab
│   ├── voice/             # Voice Generator
│   ├── social/            # Social Engine
│   ├── advanced/          # Advanced Tools
│   └── registry.ts
├── engines/
│   └── file-generator.ts   # File generation engine
├── services/
│   └── credits.ts         # Credit system
├── lib/
│   ├── supabase.ts
│   └── utils.ts
├── components/             # UI components
├── supabase/
│   └── schema.sql         # DB schema
└── public/
    └── generated/         # Generated projects (runtime)
```

## Module Structure (per section)

Each module exports:
- `id`, `name`, `description`, `credits`
- `getPrompt(input, options)` → { system, user }
- `getSchema()` → JSON schema
- `generate(output, options)` → GenerationResult

## Core Engine Flow

1. User prompt → `analyzePrompt()` → GenerationPlan
2. Plan → `executePlan()` → parallel module execution
3. Each module: AI → structured JSON → file generator
4. Result → preview URL, ZIP export, deployment
