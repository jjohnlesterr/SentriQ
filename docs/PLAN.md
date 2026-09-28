# SentriQ Functional Stabilization Plan

## Main Goal

Make the existing SentriQ application reliably functional before doing major UI redesign or code cleanup.

The application should have working:

- authentication
- Supabase integration
- quiz creation and participation
- teacher/student flows
- quiz monitoring
- AI-related features
- deployment/environment configuration
- Cloudflare deployment compatibility
- responsive core flows

## Priority Order

### Phase 1 — Environment & Configuration

Audit and fix all required environment variables.

Identify every usage of:

- `process.env`
- Supabase URL/key variables
- Gemini API variables
- OpenRouter API variables
- Cloudflare-related environment/configuration
- any other external service credentials

Produce a clear list of:

- required variables
- optional variables
- where each variable is used
- which variables are safe for client exposure
- which must remain server-only

Rules:

- Never expose private API keys in `NEXT_PUBLIC_*` variables.
- Ensure local development has a valid environment configuration (provide `.env.example`).
- Do not hardcode credentials.

### Phase 2 — Supabase

Verify the current Supabase implementation:

- browser client
- server client
- middleware/proxy
- authentication
- sessions
- cookies
- server actions
- database queries
- RLS assumptions
- user profiles
- teacher/student roles

Fix blocking Supabase bugs before cosmetic work.

Pay special attention to any server action incorrectly using a browser Supabase client.

Do not redesign the database schema unless absolutely necessary.

### Phase 3 — Authentication

Verify:

- sign up
- sign in
- sign out
- session persistence
- protected routes
- role-based routing
- teacher access
- student access

Failed authentication must show usable error feedback rather than silently failing.

### Phase 4 — Core Quiz Flows

Test the application end-to-end.

Teacher:

- create quiz
- configure quiz
- create/start session
- generate/share quiz/session code if applicable
- monitor participants
- see submissions/results

Student:

- join quiz/session
- answer quiz
- submit
- receive expected result/status

Fix broken buttons, forms, actions, redirects, state transitions, and missing validations.

Preserve existing business logic where possible.

### Phase 5 — AI Integration

Determine from the actual source code and dependencies whether SentriQ uses Google Gemini, OpenRouter, both, or another provider. Do not guess.

Verify:

- API client
- API endpoint
- model configuration
- API key environment variables
- server-side execution
- request validation
- error handling
- rate/error states

Rules:

- Private AI API keys must remain server-side.
- If multiple abandoned AI integrations exist, identify the active one and avoid maintaining duplicates.
- Only fix what is required to make existing AI functionality work.
- Do not replace the provider unless there is a clear reason.

### Phase 6 — Cloudflare / Deployment

Determine how this Next.js application is intended to run on Cloudflare.

Inspect:

- `package.json` scripts
- `next.config`
- Cloudflare configuration files
- adapters/packages
- runtime assumptions
- environment variable handling
- unsupported Node APIs
- build output
- existing deployment documentation

Do not blindly migrate deployment architecture. Make the smallest changes required for compatibility.

Verify:

- production build succeeds
- environment variables are correctly configured
- server functionality works in the target runtime
- Supabase and AI requests work from production

### Phase 7 — Functional QA

Test all important flows after fixes. Minimum checklist:

- [ ] app boots locally
- [ ] no critical console/runtime errors
- [ ] sign in/out works
- [ ] protected pages work
- [ ] teacher flow works
- [ ] student flow works
- [ ] quiz flow works
- [ ] monitoring works
- [ ] AI functionality works
- [ ] failed requests show understandable errors
- [ ] mobile core flows remain usable
- [ ] production build succeeds

### Phase 8 — UI Polish

Only after functional stability:

- remove unnecessary mascots/decorations
- reduce AI-generated visual patterns
- improve typography
- improve spacing
- improve components
- use Pixel Crew and Impeccable

### Phase 9 — Code Cleanup

Only after functionality and UI are stable:

- dead code
- unused dependencies
- duplicate components
- large assets
- architecture cleanup
- performance optimization

## Rules

- Functionality before aesthetics.
- Fix blocking issues first.
- Avoid unnecessary rewrites.
- Preserve working behavior.
- Make small, verifiable changes.
- Test after each major change.
- Never expose secrets.
- Do not assume an integration exists: verify it from the code.
