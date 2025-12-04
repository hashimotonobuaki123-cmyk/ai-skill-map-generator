# AI Skill Map Generator – Functional Specification (English)

This document is a **one‑page functional overview for English–speaking reviewers** (hiring managers / engineers).  
For more detail, see the Japanese spec (`docs/spec.md`) and the main `README.md`.

## 1. Purpose and Target Users

- **Purpose**: Support junior–to–mid Web engineers in their **first job change** by:
  - Visualising current skills
  - Providing 30 / 90 day learning roadmaps
  - Matching to job descriptions
  - Calculating an overall job–readiness score (0–100)
- **Target users**: 20–30s Web engineers, mainly frontend / full‑stack oriented.

## 2. Key Screens

1. **Home `/`**
   - Free‑text input of skills / experience
   - Career goal select box
   - Optional GitHub repository URL
   - “Insert sample text” helper

2. **Result `/result/:id`**
   - **Overview tab**
     - Skill radar chart
     - Job readiness score card
     - “Class” label (e.g. frontend mage) + badges
     - Strengths / weaknesses
     - Profile story
   - **Learning tab**
     - 30 / 90 day roadmap (timeline style)
   - **Career & Jobs tab**
     - Career risk radar (obsolescence / bus factor / automation)
     - Job matching (score, missing skills, mini roadmap)
   - **Export tab**
     - Copy as Markdown / JSON / resume template

3. **Dashboard `/dashboard`**
   - List of past skill maps
   - Main strength badge per entry
   - Shows only current user’s data when logged in

4. **Portfolio helper `/portfolio`**
   - Input multiple GitHub / project URLs
   - Outputs top 3 projects with description, appeal points, Markdown snippet

5. **About `/about`**
   - Product goal
   - Author’s role
   - Tech stack
   - Future improvement ideas

## 3. Main Features

- **Skill map generation**
  - Input: skill / experience text, career goal, optional GitHub URL, optional user id
  - Output: category levels, strengths / weaknesses, 30 / 90 day roadmap, next skills
  - Persistence: stored in Supabase `skill_maps` (JSON)

- **Job readiness score**
  - Input: category levels + job match score + risk metrics + preparation score
  - Output: score (0–100), level (`high` / `medium` / `low`), human‑readable comment
  - Logic: pure function in `lib/readiness.ts`

- **Job matching**
  - Input: skill map + job description text or URL
  - Output: match score, matched / missing skills, dedicated mini roadmap

- **Career risk**
  - Output: three risk scores (0–100) and radar chart

- **Portfolio inventory**
  - Output: top 3 projects with description / appeal points / Markdown

- **Auth**
  - Email + password signup / login (Supabase Auth)
  - `skill_maps.user_id` is set for logged‑in users

- **Usage logging**
  - Logs feature usage events into `usage_logs`
  - Visualised via `/admin/usage`

## 4. Non‑Functional Notes (Very Short)

- **Tech**: Next.js 15 (App Router), TypeScript, Tailwind, Supabase, OpenAI, Chart.js.
- **Quality**: TypeScript + Zod, unit tests (Vitest), basic E2E / screenshot tests (Playwright).
- **CI**: GitHub Actions runs `npm run build` + `npm run test` on every push to `main`.


