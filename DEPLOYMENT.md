# FERDOUS AI - Deployment Guide

## Deployment Targets

- **Vercel** (recommended for Next.js)
- **Railway**
- **GitHub** export
- **ZIP** download

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

## Vercel Deployment

1. Connect GitHub repo
2. Set environment variables
3. Build command: `npm run build`
4. Output: Next.js

## Database Setup

Run `supabase/schema.sql` in Supabase SQL Editor to create tables.

## Generated Projects

Projects are written to `public/generated/` and served statically at `/generated/{projectId}/`.
