# SentriQ Working Skills & Conventions

How to work on SentriQ during functional stabilization. Read `docs/PLAN.md` first; this file covers *how* to execute it.

## Current Focus

**Functionality first.** No major UI redesign, no deep refactors, no rewriting working architecture unless it blocks a fix.

## Stack

- **Next.js 16** (App Router) — this version has breaking changes. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code. Note: request interception lives in `proxy.ts` (formerly `middleware.ts`).
- **React 19**, **TypeScript**, **Tailwind CSS 4**, shadcn/Radix UI
- **Supabase** via `@supabase/ssr` + `@supabase/supabase-js`
- **Zod 4** for validation
- **Google Gemini** via `@google/generative-ai` (verify active usage before changing)
- **Cloudflare Turnstile** via `@marsidev/react-turnstile`

## Codebase Map

| Area | Location |
| --- | --- |
| Routes / pages | `app/` |
| UI components | `components/` (feature folders, e.g. `components/teacher/`) |
| Server actions | `lib/actions/*.actions.ts` |
| Supabase clients | `lib/supabase/browser.ts`, `server.ts`, `middleware.ts` |
| Route protection | `proxy.ts` |
| Business logic | `lib/services/`, `lib/quiz/` |
| Validation schemas | `lib/validations/` |
| Shared types/utils | `lib/shared/`, `lib/utils.ts` |
| Client state | `store/`, `hooks/` |
| Constants | `constants/` |

## Core Skills

### 1. Verify before changing

- Trace the actual code path (component → action → service → Supabase) before editing.
- Never assume an integration, env var, or table exists — grep for it.
- Reproduce the bug before fixing it; confirm the fix afterwards.

### 2. Supabase correctness

- Server actions, route handlers, and server components use `lib/supabase/server.ts`.
- Client components use `lib/supabase/browser.ts`.
- Session refresh happens in `proxy.ts` via `lib/supabase/middleware.ts`.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and bypasses RLS — use only where required, never in client code.
- Always check and surface `error` from Supabase calls; don't discard it.

### 3. Environment & secrets

- `NEXT_PUBLIC_*` = shipped to the browser. Only public values (Supabase URL/anon key, Turnstile site key).
- AI keys, service-role keys, and Turnstile secrets stay server-only.
- Never commit `.env`. Keep `.env.example` updated with every variable name (no values).
- Fail clearly when a required variable is missing instead of crashing with an undefined error.

### 4. Server actions & error handling

- Validate input with Zod on the server, even if the client already validates.
- Return a consistent result shape (e.g. `{ success, data?, error? }`) rather than throwing to the UI.
- Show failures to the user (e.g. `sonner` toast or inline message) — no silent failures.
- Check auth and role inside every protected action, not only in `proxy.ts`.

### 5. AI features

- AI calls run server-side only (server actions or route handlers).
- Validate prompts/inputs, handle timeouts, rate limits, and malformed model output.
- Parse structured AI output defensively (Zod) before saving or rendering.

### 6. Cloudflare compatibility

- Confirm the target runtime before adding Node-only APIs (`fs`, `child_process`, native modules).
- Prefer Web-standard APIs (`fetch`, `crypto.subtle`, `Request`/`Response`).
- Make the smallest change that works; don't swap deployment architecture without a clear need.

### 7. Small, verifiable changes

- One concern per change/commit.
- After each change: `npm run lint`, `npm run build`, and manually test the affected flow.
- Preserve existing business logic and behavior unless it is the bug.

## Verification Commands

```bash
npm run dev     # local dev server
npm run lint    # ESLint
npm run build   # production build (must pass before merging)
```

## Definition of Done (per fix)

- [ ] Root cause identified in code, not guessed
- [ ] Fix is minimal and scoped
- [ ] No secrets exposed to the client
- [ ] Errors surface to the user
- [ ] Lint and build pass
- [ ] Affected flow tested manually (desktop + mobile width for core flows)

## Out of Scope (for now)

- Visual redesign, mascot/decoration removal, typography overhaul (Phase 8)
- Dead code removal, dependency pruning, architecture cleanup (Phase 9)
- Database schema redesign
- Replacing the AI provider or deployment platform without a blocking reason
