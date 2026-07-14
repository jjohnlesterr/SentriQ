# SentriQ Project Standards

## Project

SentriQ is a quiz creation and real-time assessment monitoring platform for teachers, students, and administrators.

The application includes:

- Quiz creation and publishing
- Student join requests
- Live assessment monitoring
- Session events
- Results and report access
- Authentication and role-based access
- Administrator management
- AI-assisted quiz features

## Technology Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui and Radix UI
- Supabase PostgreSQL
- Supabase Auth
- Zod
- Framer Motion
- Cloudflare Turnstile
- Google Gemini
- Sonner

## Working Principles

- Inspect all relevant code before editing.
- Understand current behavior before proposing changes.
- Explain the implementation plan before making large, architectural, security-sensitive, or high-risk changes.
- Prefer minimal and targeted changes over broad rewrites.
- Preserve existing behavior unless a change is explicitly requested or required to fix a confirmed bug.
- Preserve existing routes, styling, database compatibility, and user flows.
- Do not redesign the interface unless explicitly requested.
- Do not guess when behavior is unclear. Preserve it and report the uncertainty.
- Make small, reviewable changes grouped by one clear responsibility.
- Do not modify more than one architectural concern in a single implementation iteration.
- Avoid unnecessary abstractions, rewrites, and premature generalization.
- Split files based on clear responsibilities, not an arbitrary line limit.

## Protected Files and Services

Do not modify these without explicit approval:

- `.env.local`
- Database records
- Supabase migrations
- Supabase Row Level Security policies
- Supabase project settings
- External services
- Production configuration

Never expose:

- Supabase service-role keys
- Private API keys
- Server-only secrets
- Sensitive environment variables

## TypeScript and Code Quality

- Do not use `any`.
- Do not use unsafe type assertions to bypass errors.
- Do not add broad ESLint suppressions.
- Do not disable TypeScript or ESLint rules to hide errors.
- Prefer explicit domain types.
- Reuse existing types, schemas, constants, helpers, and components when appropriate.
- Remove code only after confirming that it is unused.
- Preserve unrelated user changes.
- Use consistent naming and import conventions.
- Avoid barrel files when they may introduce circular dependencies or unnecessarily large bundles.

## Architecture

- Move toward feature-based organization where practical.
- Keep Next.js route files inside `app/`.
- Keep route files thin and delegate business logic to feature modules.
- Separate presentation, state management, validation, server actions, services, database access, constants, and domain types.
- Prefer React Server Components by default.
- Add `"use client"` only when state, effects, event handlers, browser APIs, or client-only libraries require it.
- Keep server-only modules out of client bundles.
- Avoid turning large component trees into client components.
- Add global providers only when genuinely required.
- Do not create empty or unnecessary provider layers.

## Target Feature Areas

Where practical, organize feature-specific code around:

- `auth`
- `teacher-dashboard`
- `quiz-builder`
- `quiz-monitor`
- `student-join`
- `student-quiz`
- `student-results`
- `admin`
- `ai`

Each feature should contain only the folders it needs, such as:

- `components`
- `hooks`
- `actions`
- `services`
- `schemas`
- `types`
- `constants`
- `utils`

Keep truly reusable application-wide code in shared locations such as:

- `components/ui`
- `components/shared`
- `lib/supabase`
- `lib/auth`
- `lib/shared`
- shared hooks
- shared types

## Supabase

- Maintain one reusable browser client singleton.
- Create server clients per request using the correct cookie context.
- Never reuse a server client globally.
- Select only the columns required by the feature.
- Avoid unnecessary full-table or full-history queries.
- Consolidate related queries only when it improves correctness or performance.
- Preserve realtime behavior.
- Clean up realtime subscriptions correctly.
- Avoid duplicate subscriptions.
- Do not modify the production database automatically.
- Propose indexes or migrations separately for review.
- Explain the purpose and expected impact of every proposed database index.

## Performance

Investigate actual bottlenecks before optimizing.

Check for:

- Duplicate Supabase browser clients
- Duplicate auth listeners
- Repeated requests
- Request waterfalls
- Repeated `router.refresh()` calls
- Broad effect dependencies
- State derived unnecessarily through effects
- Realtime subscriptions without cleanup
- Duplicate subscriptions during development
- Duplicate loading screens
- Excessive client-side fetching
- Full session or event histories fetched when only summaries are needed
- N+1 queries
- Large client component boundaries
- Expensive rerenders
- Unstable callbacks
- Large image assets
- Improper `next/image` usage
- Unnecessary prefetching
- Excessive RSC navigation requests

Use memoization only when there is a clear reason or measurable benefit.

## Security

- Validate all untrusted input with Zod.
- Verify authentication in server-side code.
- Verify teacher and administrator roles server-side.
- Verify quiz ownership.
- Verify session ownership and authorization.
- Do not trust client-supplied IDs, roles, scores, statuses, or permissions.
- Do not expose correct answers before quiz completion.
- Do not expose server-only credentials.
- Avoid unsafe error disclosure.
- Check for open redirects.
- Respect client/server trust boundaries.
- Do not silently change security-sensitive behavior.
- Explain every security-related correction before implementation.

## UI and Accessibility

Preserve the existing SentriQ visual design unless redesign is explicitly requested.

Check:

- Buttons and clickable elements
- Keyboard navigation
- Focus-visible states
- Accessible labels
- Disabled states
- Cursor behavior
- Modal focus handling
- Loading indicators
- Reduced-motion support
- Mobile sidebar behavior
- Layout shifts
- Duplicate loading screens

Do not replace the existing UI component system with another UI library.

## Change Risk

For every proposed refactor, report:

- Complexity: `LOW`, `MEDIUM`, or `HIGH`
- Risk: `SAFE`, `MEDIUM RISK`, or `HIGH RISK`
- Expected impact
- Exact files likely to be affected
- Dependencies on other changes
- Validation required

Do not proceed with a `HIGH RISK` change without explicit approval.

## Validation

After every meaningful implementation phase:

- Run `npm run lint`.
- Run `npm run build`.
- Review TypeScript and editor diagnostics.
- Perform focused manual checks for affected user flows.
- Summarize changed files.
- Report validation results.
- Report remaining risks and uncertainties.

Do not continue to another feature or phase when validation fails.

## Git Workflow

- Show `git status` before each implementation phase.
- List the exact files intended to change.
- Explain the intended change before editing.
- Do not use destructive Git commands.
- Do not commit or push unless explicitly instructed.
- Do not create one enormous commit.
- Suggest a focused Conventional Commit message after successful validation.