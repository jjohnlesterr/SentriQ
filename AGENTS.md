# SentriQ Project Standards

## Project

SentriQ is a quiz creation and real-time assessment monitoring platform.

## Technology Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui and Radix UI
- Supabase PostgreSQL and Supabase Auth
- Zod
- Framer Motion
- Cloudflare Turnstile
- Google Gemini
- Sonner

## Core Rules

- Inspect the relevant code before editing.
- Explain the implementation plan before making large or risky changes.
- Preserve existing behavior, routes, styling, database compatibility, and user flows.
- Do not redesign the interface unless explicitly requested.
- Do not modify `.env.local`, migrations, Supabase policies, database records, or external services without approval.
- Never expose server-only secrets to client components.
- Do not use `any`, unsafe type assertions, or broad lint suppressions.
- Do not disable TypeScript or ESLint rules to hide errors.
- Do not use destructive Git commands.
- Preserve unrelated user changes.
- Make small, reviewable changes grouped by responsibility.
- Avoid unnecessary rewrites, abstractions, and premature generalization.
- Split files by responsibility, not by an arbitrary line limit.

## Architecture

- Prefer feature-based organization where practical.
- Keep Next.js route files inside `app/`.
- Keep route files thin and delegate feature logic to feature modules.
- Prefer React Server Components by default.
- Add `"use client"` only when state, effects, event handlers, or browser APIs require it.
- Keep server-only code out of client bundles.
- Reuse existing components, types, schemas, constants, and utilities.
- Avoid duplicate helpers and duplicate domain types.
- Avoid barrel files that can cause circular dependencies or oversized bundles.

## Supabase

- Use one reusable browser client singleton.
- Create server clients per request using the correct cookie context.
- Never reuse a server client globally.
- Select only required columns.
- Preserve realtime behavior and clean up subscriptions correctly.
- Do not change the production database automatically.
- Propose SQL migrations or indexes separately for review.

## Security

- Validate untrusted input with Zod.
- Verify authentication, roles, ownership, and authorization in server-side code.
- Do not trust client-supplied IDs, roles, scores, statuses, or permissions.
- Do not expose correct answers before quiz completion.
- Do not silently change security-sensitive behavior.

## Validation

After meaningful changes:

- Run `npm run lint`.
- Run `npm run build`.
- Review TypeScript and editor diagnostics.
- Summarize changed files, validation results, and remaining risks.

## Git Workflow

- Show `git status` before each implementation phase.
- List the exact files intended to change.
- Do not commit or push unless explicitly instructed.
- Suggest a focused Conventional Commit message after successful validation.