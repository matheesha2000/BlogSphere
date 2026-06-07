# PROGRESS.md — BlogApp Daily Updates

**Project:** BlogApp — Next.js + Supabase + Stripe  
**Developer:** Matheesha Kalatuwawa
**Timeline:** June 4–7, 2026  
**Repository:** https://github.com/matheesha2000/BlogSphere.git

---

## Day 1: Thusday, June 4

### ✅ Completed

- Created public GitHub repository and shared link with coordinator
- Bootstrapped Next.js 14 app with TypeScript, Tailwind CSS, and App Router using `create-next-app`
- Created Supabase project and configured region
- Ran all three SQL migrations in order:
  - `001_create_profiles.sql` — profiles table with RLS policies and auto-create trigger on signup
  - `002_create_posts.sql` — posts table with RLS, slug index, and auto-updated_at trigger
  - `003_create_subscriptions.sql` — subscriptions table with RLS (service role only writes)
- Created `lib/supabase/client.ts` (browser client) and `lib/supabase/server.ts` (server client with cookie handling)
- Created `lib/utils.ts` with slugify, formatDate, truncate, getExcerpt, and helper functions
- Created `types/index.ts` with Post, Profile, and Subscription TypeScript interfaces
- Configured `.env.local` with all Supabase keys
- Built `middleware.ts` — protects `/dashboard/*` routes, redirects logged-in users away from `/login` and `/signup`, handles session token refresh automatically
- Created `useUser.ts` hook with real-time auth state listener
- Built `LoginForm.tsx` — email/password, show/hide password toggle, loading spinner, error banner
- Built `SignupForm.tsx` — full name, email, password strength bar, confirm password with mismatch detection, email confirmation success screen
- Created `/login` and `/signup` pages with `(auth)` route group layout
- Built `Navbar.tsx` — auth-aware links, loading skeleton, mobile hamburger menu, active link highlighting
- Built `Footer.tsx`
- Tested full auth flow: sign up → email confirmation → login → session → logout — all working

### 🔜 Next Steps

- Build public post listing pages (homepage, /posts)
- Build SearchBar component with URL-based search
- Build PostCard and PostList components
- Create API routes for posts CRUD
- Build PostForm for create and edit

### ❗ Challenges

- Took longer than expected to understand the difference between `createBrowserClient` and `createServerClient` — using the wrong one in Server Components caused the auth session to always return null. Resolved by strictly keeping server client in server-only files.
- Supabase email confirmation was on by default which slowed down auth testing. Temporarily disabled it in Auth Settings for development.

### 📌 Status: ✅ On Track

---

## Day 2: Friday, June 4

### ✅ Completed

- Built `SearchBar.tsx` — uses `useTransition` for pending state, pushes `?q=` query param to URL, server re-fetches on param change without full page reload
- Built `PostCard.tsx` — displays title, excerpt, author name, date, premium badge, hover animations
- Built `PostList.tsx` — maps over posts array with empty state handling
- Built `PostContent.tsx` — renders post body with basic heading detection (# ## ###)
- Built `PremiumGate.tsx` — shows first 300 chars, gradient fade, subscribe CTA with two action buttons
- Homepage (`app/page.tsx`) — hero section with two CTA buttons, search bar, post listing with server-side search using Supabase `.ilike()`
- Posts page (`app/posts/page.tsx`) — full post listing with search, separate from homepage
- `GET /api/posts` — list published posts with optional search query parameter
- `POST /api/posts` — create post with auth check, excerpt generation, slug generation
- `PATCH /api/posts/[id]` — update post, RLS enforces owner-only access
- `DELETE /api/posts/[id]` — delete post, RLS enforces owner-only access
- `GET /api/posts/[id]` — fetch single post by ID
- Built `PostForm.tsx` — dual mode (create and edit), toggle switches for premium and published, delete button in edit mode with confirmation dialog
- Single post page `posts/[slug]/page.tsx` — fetch by slug, check subscription for premium, show PremiumGate or full content
- Dashboard page — my posts list with view/edit links, subscription status card, new post button
- New post page and edit post page
- Seeded 20 sample articles — 12 free and 8 premium — via SQL in Supabase SQL Editor
- Added author full_name to profiles table, confirmed it shows on all posts

### 🔜 Next Steps

- Set up Stripe product and price in dashboard
- Build `/api/checkout` route
- Build subscribe page with checkout button
- Build Stripe webhook handler — the most complex part
- Build `useSubscription.ts` hook with real-time listener
- Test full subscription flow locally with Stripe CLI

### ❗ Challenges

- The `PostForm.tsx` took longer than estimated — handling the dual create/edit mode, the toggle switches, and delete confirmation in a clean way required more iterations than expected.
- Supabase `.maybeSingle()` vs `.single()` — `.single()` throws an error when 0 rows are returned. Switched to `.maybeSingle()` throughout for cleaner error handling.

### 📌 Status: ✅ On Track

---

## Day 3: Saturday, June 6

### ✅ Completed

- Created Stripe account, created BlogApp Premium product, set monthly recurring price at $9.00, copied Price ID to `.env.local`
- Created `lib/stripe.ts` — shared Stripe instance pinned to API version `2024-06-20`, plus helper functions: `getOrCreateCustomer`, `createCheckoutSession`, `cancelSubscription`, `constructWebhookEvent`
- Installed Stripe CLI, ran `stripe listen --forward-to localhost:3000/api/webhooks/stripe`, copied `whsec_xxx` signing secret to `.env.local`
- Built `POST /api/checkout` — auth check, get/create Stripe customer, create checkout session with `mode: 'subscription'`, return session URL
- Built subscribe page — pricing card with feature list, checkout button, handles loading state, redirects logged-out users to `/login?redirectTo=/subscribe`
- Built subscribe success page and subscribe cancel page
- Built `useSubscription.ts` — queries subscriptions table for active status, real-time Supabase channel listener fires refetch when row changes, exposes `refetch()` for manual checks
- Built `POST /api/webhooks/stripe` — reads raw body with `request.text()`, verifies Stripe signature with `constructWebhookEvent()`, handles `checkout.session.completed` (creates subscription row), `customer.subscription.updated` (updates status), `customer.subscription.deleted` (sets status to canceled), uses service role client to bypass RLS
- Tested full subscription flow locally:
  - Clicked Subscribe → Stripe checkout opened ✅
  - Entered test card `4242 4242 4242 4242` → payment processed ✅
  - Redirected to `/subscribe/success` ✅
  - Stripe CLI logged `checkout.session.completed` webhook ✅
  - Supabase subscriptions table shows `status = active` ✅
  - Visited premium article — full content visible without PremiumGate ✅
  - Real-time listener fired — no page reload needed ✅

### 🔜 Next Steps

- Deploy to Vercel
- Add all environment variables in Vercel settings
- Register Stripe webhook endpoint in production Stripe dashboard
- Run final end-to-end smoke test on live URL
- Finalize all three documentation files
- Push final commit before 5:30 PM

### ❗ Challenges

- The webhook handler was the hardest part of the project. First attempt used `request.json()` to parse the body — signature verification failed every time with a 400 error. Fixed by switching to `request.text()` to keep the raw body string intact before passing to `stripe.webhooks.constructEvent()`.
- Webhook initially used the anon Supabase client which RLS blocked from writing to the subscriptions table. Fixed by creating a separate service role client using `SUPABASE_SERVICE_ROLE_KEY` which bypasses RLS.
- Real-time listener in `useSubscription.ts` was not firing — confirmed that replication was not enabled for the subscriptions table in Supabase. Enabled it under Database → Replication → subscriptions table → toggle on.

### 📌 Status: ✅ On Track

---

## Day 4: Sunday, June 7

### ✅ Completed

- Deployed to Vercel — imported GitHub repository, added all 8 environment variables, deployment succeeded on first attempt in 58 seconds
- Updated `NEXT_PUBLIC_SITE_URL` to Vercel URL in Vercel environment variables, triggered a redeploy
- Registered production Stripe webhook endpoint at `https://your-app.vercel.app/api/webhooks/stripe` in Stripe dashboard, selected three events (`checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`), updated `STRIPE_WEBHOOK_SECRET` in Vercel with the new production signing secret
- Ran full end-to-end smoke test on live Vercel URL:
  - Homepage loads with 20 sample articles ✅
  - Search works — filters articles in real time ✅
  - Free articles readable without login ✅
  - Premium articles show PremiumGate for non-subscribers ✅
  - Sign up flow works, profiles table creates row automatically ✅
  - Login and logout work correctly ✅
  - Middleware blocks `/dashboard` for logged-out users ✅
  - Post creation works — new article appears on homepage ✅
  - Post editing and deletion work ✅
  - Stripe checkout opens from subscribe page ✅
  - Test card payment succeeds ✅
  - Production webhook fires and subscription row created ✅
  - Premium articles unlock immediately after payment ✅
- Finalized `README.md` — added live Vercel URL, setup guide, database schema, deployment steps, completed and pending features
- Completed `TASKS.md` — all 47 tasks marked with status and actual time
- Wrote all four daily `PROGRESS.md` entries
- Final commit message: "Final submission — all features complete"
- Pushed to GitHub at 4:45 PM — 45 minutes before deadline

### ❗ Challenges

- Vercel deployment initially failed because `SUPABASE_SERVICE_ROLE_KEY` was accidentally added with a trailing space. Removed the space, redeployed, and it worked.
- Production Stripe webhook used the wrong signing secret on first test — the production secret from the Stripe dashboard is different from the local CLI secret. Updated Vercel env var with the correct production `whsec_xxx` value.

### 📌 Status: ✅ Submitted — Final commit pushed 
---

## Final Summary

| Day | Focus | Status |
|---|---|---|
| Day 1 — Tue June 4 | Setup, Supabase DB, Auth | ✅ Completed |
| Day 2 — Wed June 5 | Public blog, post CRUD, dashboard | ✅ Completed |
| Day 3 — Thu June 6 | Stripe, webhooks, premium gate | ✅ Completed |
| Day 4 — Fri June 7 | Deploy, test, documentation, submit | ✅ Submitted |

**Total tasks completed:** 47 / 47  
**Live URL:** https://blog-sphere-ochre.vercel.app/
**Repository:** https://github.com/matheesha2000/BlogSphere.git