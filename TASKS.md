# TASKS.md — BlogApp Project

## Project Overview
Full-stack blog publication app with free and premium content, built using Next.js 14, Supabase, and Stripe.
**Timeline:** June 4–7 | **Deadline:** Monday June 8

---

## Summary

| Category | Total Tasks | Completed | Remaining |
|---|---|---|---|
| Setup & Config | 8 | 8 | 0 |
| Authentication | 6 | 6 | 0 |
| Public Blog | 7 | 7 | 0 |
| Content Management | 8 | 8 | 0 |
| Stripe & Payments | 8 | 8 | 0 |
| Deployment | 5 | 5 | 0 |
| Documentation | 5 | 5 | 0 |
| **TOTAL** | **47** | **47** | **0** |

---

## 🗂 PHASE 1 — Setup & Configuration
> Day 1 · Thursday June 4

| # | Task | Estimate | Actual | Status |
|---|---|---|---|---|
| 1.1 | Create GitHub repository and share link with coordinator | 15 min | 15 min | ✅ Done |
| 1.2 | Bootstrap Next.js 14 app with TypeScript, Tailwind, App Router | 20 min | 20 min | ✅ Done |
| 1.3 | Create Supabase project, choose region | 10 min | 10 min | ✅ Done |
| 1.4 | Run migration 001 — create profiles table with RLS | 20 min | 25 min | ✅ Done |
| 1.5 | Run migration 002 — create posts table with RLS | 20 min | 20 min | ✅ Done |
| 1.6 | Run migration 003 — create subscriptions table with RLS | 15 min | 15 min | ✅ Done |
| 1.7 | Create lib/supabase/client.ts and lib/supabase/server.ts | 15 min | 15 min | ✅ Done |
| 1.8 | Configure .env.local with Supabase keys | 10 min | 10 min | ✅ Done |

**Phase 1 Total — Estimated:** 2h 5min | **Actual:** 2h 10min

---

## 🔐 PHASE 2 — Authentication
> Day 2 · Friday June 5

| # | Task | Estimate | Actual | Status |
|---|---|---|---|---|
| 2.1 | Create middleware.ts — protect /dashboard, redirect auth pages | 30 min | 35 min | ✅ Done |
| 2.2 | Create useUser.ts hook — current session | 15 min | 15 min | ✅ Done |
| 2.3 | Build LoginForm.tsx — email/password + show/hide toggle + error display | 45 min | 50 min | ✅ Done |
| 2.4 | Build SignupForm.tsx — full name, email, password strength bar, confirm | 45 min | 55 min | ✅ Done |
| 2.5 | Create (auth)/login/page.tsx and (auth)/signup/page.tsx | 20 min | 15 min | ✅ Done |
| 2.6 | Test full auth flow — signup, confirm, login, session, logout | 30 min | 40 min | ✅ Done |

**Phase 2 Total — Estimated:** 3h 5min | **Actual:** 3h 30min

---

## 📰 PHASE 3 — Public Blog
> Day 2 · Friday June 5

| # | Task | Estimate | Actual | Status |
|---|---|---|---|---|
| 3.1 | Build Navbar.tsx — auth-aware links, mobile hamburger menu | 45 min | 50 min | ✅ Done |
| 3.2 | Build Footer.tsx | 15 min | 10 min | ✅ Done |
| 3.3 | Build PostCard.tsx — title, excerpt, date, author, premium badge | 30 min | 35 min | ✅ Done |
| 3.4 | Build PostList.tsx — maps over posts, empty state | 20 min | 15 min | ✅ Done |
| 3.5 | Build SearchBar.tsx — URL-based search with useTransition | 30 min | 35 min | ✅ Done |
| 3.6 | Homepage (app/page.tsx) — hero section + post list + search | 40 min | 45 min | ✅ Done |
| 3.7 | Posts page (app/posts/page.tsx) — full listing with search | 20 min | 20 min | ✅ Done |

**Phase 3 Total — Estimated:** 3h 20min | **Actual:** 3h 30min

---

## ✏️ PHASE 4 — Content Management
> Day 3 · Saturday June 6

| # | Task | Estimate | Actual | Status |
|---|---|---|---|---|
| 4.1 | POST /api/posts — create post with slug generation | 45 min | 50 min | ✅ Done |
| 4.2 | PATCH /api/posts/[id] — update post (owner check via RLS) | 20 min | 20 min | ✅ Done |
| 4.3 | DELETE /api/posts/[id] — delete post (owner check via RLS) | 15 min | 15 min | ✅ Done |
| 4.4 | Build PostContent.tsx — render article body with heading support | 20 min | 25 min | ✅ Done |
| 4.5 | Build PostForm.tsx — dual mode (create/edit), premium toggle, delete | 1h | 1h 10min | ✅ Done |
| 4.6 | Single post page posts/[slug]/page.tsx — with premium gate logic | 45 min | 50 min | ✅ Done |
| 4.7 | Dashboard page — my posts list, subscription status, new post button | 45 min | 45 min | ✅ Done |
| 4.8 | New post page + Edit post page | 30 min | 30 min | ✅ Done |

**Phase 4 Total — Estimated:** 5h | **Actual:** 5h 25min

---

## 💳 PHASE 5 — Stripe & Premium
> Day 3 · Saturday June 6

| # | Task | Estimate | Actual | Status |
|---|---|---|---|---|
| 5.1 | Create Stripe product and monthly recurring price ($9) | 20 min | 20 min | ✅ Done |
| 5.2 | Create lib/stripe.ts — shared Stripe instance + helpers | 20 min | 25 min | ✅ Done |
| 5.3 | POST /api/checkout — create Stripe checkout session | 1h | 1h 10min | ✅ Done |
| 5.4 | Build subscribe/page.tsx — pricing card + checkout button | 30 min | 30 min | ✅ Done |
| 5.5 | Build subscribe/success and subscribe/cancel pages | 20 min | 15 min | ✅ Done |
| 5.6 | Build PremiumGate.tsx — content blur + upsell overlay | 30 min | 35 min | ✅ Done |
| 5.7 | Build useSubscription.ts — DB query + real-time listener | 40 min | 50 min | ✅ Done |
| 5.8 | POST /api/webhooks/stripe — verify signature + handle events | 1h 30min | 1h 45min | ✅ Done |

**Phase 5 Total — Estimated:** 5h 30min | **Actual:** 6h 10min

---

## 🚀 PHASE 6 — Deployment
> Day 4 · Sunday June 7

| # | Task | Estimate | Actual | Status |
|---|---|---|---|---|
| 6.1 | Deploy to Vercel — import repo, add all env vars | 30 min | 35 min | ✅ Done |
| 6.2 | Register Stripe webhook endpoint in production dashboard | 15 min | 15 min | ✅ Done |
| 6.3 | Update NEXT_PUBLIC_SITE_URL to Vercel URL | 5 min | 5 min | ✅ Done |
| 6.4 | End-to-end smoke test on live URL | 45 min | 50 min | ✅ Done |
| 6.5 | Add 20 sample articles via seed SQL | 20 min | 25 min | ✅ Done |

**Phase 6 Total — Estimated:** 1h 55min | **Actual:** 2h 10min

---

## 📄 PHASE 7 — Documentation
> Day 4 · Sunday June 7

| # | Task | Estimate | Actual | Status |
|---|---|---|---|---|
| 7.1 | Finalize README.md with live URL, setup guide, schema | 30 min | 35 min | ✅ Done |
| 7.2 | Complete TASKS.md with all tasks and completion status | 20 min | 20 min | ✅ Done |
| 7.3 | Write all 4 daily PROGRESS.md entries | 30 min | 30 min | ✅ Done |
| 7.4 | Mark incomplete/pending features clearly in README | 10 min | 10 min | ✅ Done |
| 7.5 | Final commit and push before 5:30 PM deadline | 5 min | 5 min | ✅ Done |

**Phase 7 Total — Estimated:** 1h 35min | **Actual:** 1h 40min

---

## ⏱ Total Time

| | Estimated | Actual |
|---|---|---|
| Phase 1 — Setup | 2h 5min | 2h 10min |
| Phase 2 — Auth | 3h 5min | 3h 30min |
| Phase 3 — Public Blog | 3h 20min | 3h 30min |
| Phase 4 — CMS | 5h | 5h 25min |
| Phase 5 — Stripe | 5h 30min | 6h 10min |
| Phase 6 — Deployment | 1h 55min | 2h 10min |
| Phase 7 — Docs | 1h 35min | 1h 40min |
| **TOTAL** | **22h 30min** | **24h 35min** |

---

## 🔜 Pending Features (Not Implemented)

These features were scoped out due to time constraints. All are marked in the README.

| Feature | Reason Not Implemented |
|---|---|
| Password reset flow | Time constraint — auth flow prioritized |
| Profile editing page | Time constraint — core features prioritized |
| Cancel subscription button | Time constraint — Stripe portal available as workaround |
| Image uploads (Supabase Storage) | Out of scope for assessment |
| Comments on posts | Out of scope for assessment |
| Email notifications | Out of scope for assessment |