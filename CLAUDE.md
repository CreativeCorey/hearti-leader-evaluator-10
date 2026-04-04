# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is
hearti.app is the assessment delivery app for PrismWork's HEARTI leadership system.
Built by Corey Jones, Founder/CEO of PrismWork, co-author of Intentional Power (Wiley, 2023).
HEARTI = Humility, Empathy, Accountability, Resiliency, Transparency, Inclusivity — always all caps.

## Commands
- `npm run dev` — local dev server at localhost:5173 (hot reload, use this for all iteration)
- `npm run build` — production build to dist/ (only when ready to deploy)
- `npm run preview` — preview the production build locally

## Two instruments — critical distinction

### HEARTI Leader Snapshot (default, free, top-of-funnel)
- 31 questions: 5 per HEARTI pillar + 6 Grace Index questions
- Questions are RANDOMIZED on mount (seeded shuffle) — do not group by pillar in the UI
- No pillar labels shown during assessment — neutral experience
- Produces: pillar scores, Grace Index (0–100), scoring band, shareable spectra graphic
- Scoring bands: Excellence (100–120), Growth Zone (80–99), Awareness (60–79), Reset (<60)
- Grace Index bands: Over-Carrying (0–40), Transitional (41–70), Integrated Grace (71–100)
- Gate: name + email only, no password

### HEARTI Enterprise / HLQ Full (gated, paid, organizational)
- 58 questions: original instrument matching the 1,651-person benchmark dataset
- Grouped by pillar (not randomized) — research integrity requires original order
- Gate: enterprise token validation (tokens stored in enterprise_tokens Supabase table)
- Produces: full 6-pillar scores, benchmark comparison, team overlay for HEARTI for Teams
- Access via: hearti.app?mode=enterprise or hearti.app?token=HEARTI-XXXX

## Architecture

**HEARTI** is a React 18 + TypeScript + Vite SPA, backed by Supabase (PostgreSQL + Edge Functions).

### Routing

There is **no React Router**. `App.tsx` is a custom state machine:

```typescript
type AppPage = 'gate' | 'enterprise-gate' | 'assessment' | 'tabulation' | 'demographics' | 'results' | 'habits'
```

State (`page`, `session`, `result`) lives at the App root and is passed as props — no Context or Redux. URL deep-linking via `?result=<uuid>` and `?mode=enterprise&token=<token>` is handled in `App.tsx` on mount.

### Page Flow

gate → assessment → tabulation → demographics → results → (habits optional)

1. **GatePage** — collects name + email, routes to snapshot or enterprise path
2. **EnterpriseGatePage** — validates one-time enterprise tokens
3. **AssessmentPage** — question carousel (31 Snapshot / 58 Enterprise questions)
4. **TabulationPage** — animated 4-second sequence between assessment and results
5. **DemographicsPage** — optional demographic capture before results reveal
6. **ResultsPage** — Spectra radar chart, band classification, social sharing
7. **HabitsPage** — post-assessment weekly habit tracker

### Assessment Logic (`src/data/questions.ts`)

All scoring is client-side:
- `calcPillarScore()` — averages Likert (1–5) scores per pillar, handles reversed questions
- `calcGraceScore()` — special 0–100 scale
- `calcTotalScore()` — avg of 6 HEARTI pillars × 25
- `getBand()` — maps total score to band label

### Data Layer (`src/lib/supabase.ts`)

All Supabase calls are in this single file. Three tables:
- `assessment_results` — completed assessments (email as identity, no auth)
- `habit_entries` — daily habit tracking keyed to pillar + date
- `enterprise_tokens` — one-time-use tokens for org distribution

### Key Components

`src/components/results/SpectraChart.tsx` — custom Canvas radar chart (not a chart library). Supports retina via `devicePixelRatio` and exports PNG via `toDataURL()` for sharing. Rendered twice: visible on-page (`showCTA=false`, strength pillar letter at center) and hidden off-screen for shareable PNG (`showCTA=true`).

`src/pages/TabulationPage.tsx` — animated 4-second sequence between assessment and results. Shows 6 pillar insight statements fading in sequentially (one per 550ms, each in its pillar color), then "Building your Spectra profile…" with a pulse animation. Calls `onComplete()` automatically when done.

`src/pages/DemographicsPage.tsx` — optional post-tabulation screen capturing management level, company size, industry, and age range. Saves to `assessment_results` table via `updateDemographics()`. Skip button bypasses without saving. Save errors are non-blocking — user always proceeds to results.

## Supabase
- Project ID: rzacoibgupyvihswhkzz
- URL: https://rzacoibgupyvihswhkzz.supabase.co
- Tables: assessment_results, enterprise_tokens, habit_entries
- Edge function: send-results-email (deployed, ACTIVE) — fires after every assessment
- Email delivery: Resend (RESEND_API_KEY set as Supabase secret)
- RLS: enabled on all tables, permissive policies (insert/select open for now)
- Auth: email-as-identity only — no Supabase Auth accounts, no passwords

## Supabase edge function
- send-results-email — deployed and ACTIVE
- Sends branded HTML results email via Resend after every completed assessment
- RESEND_API_KEY stored as Supabase secret
- verify_jwt: false (called from client-side after assessment completion)

## Env vars required (.env)

```
VITE_SUPABASE_URL=https://rzacoibgupyvihswhkzz.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Auto-generated TypeScript types: `src/integrations/supabase/types.ts`

## Brand
- Primary purple: #4B3FA0
- Teal (strength): #1D9E75
- Coral (vulnerability): #D85A30
- Amber: #BA7517
- Transparency pillar: #7C6FD4
- Inclusivity pillar: #0F6E56
- Background: #F8F7FF
- Ink: #0F0E1A
- Muted text: #5A5870
- Fonts: Playfair Display (headings, logo) + DM Sans (body)

## Key product decisions — do not revert
- Snapshot questions are randomized on mount — never group by pillar or show dimension names during assessment
- No "Consider carefully" hint on reverse-scored questions — neutral framing only
- Grace Index displayed separately from HEARTI score — never averaged in
- Shareable spectra PNG uses a hidden off-screen canvas with showCTA=true
- Visible on-page chart has showCTA=false, strengthPillar letter shown at center
- Enterprise instrument preserves original 58-question order (feeds 1,651-person benchmark)
- No Supabase Auth — email is the identity, stored directly in assessment_results

## Product context
- prismwork.com — enterprise buyer site (CHROs, VP Talent, DEI leads)
- heartiquotient.com — individual leader marketing gateway
- HEARTI Foundations — $397 product → heartiquotient.com/for-leaders
- HEARTI for Teams — from $7,500 → prismwork.com/for-organizations
- Intentional Power (Wiley, 2023) — co-authored by Corey Jones & Lisen Stromberg
- HLQ Research Report — 16-page PDF built on the 1,651-person dataset, v3 published

## Deployment
- Upload dist/ contents to Bluehost via cPanel File Manager → hearti.app document root
- No CI/CD — build locally with npm run build, upload manually
- Redirects handled by Cloudflare (not .htaccess)
- Related sites also on Bluehost: prismwork.com, heartiquotient.com
