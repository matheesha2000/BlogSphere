# BlogApp 📝

A full-stack blog publication application built with **Next.js 14**, **Supabase**, and **Stripe**. Readers can browse free articles publicly and unlock premium content with a monthly subscription.

## 🌐 Live Demo

> **Live URL:** https://blog-sphere-ochre.vercel.app/ 

---

## ✨ Features

### Public (No Login Required)
- Browse all published articles on the homepage and `/posts`
- Search articles by title or content
- Read full free articles
- Preview the first 300 characters of premium articles with a subscribe call-to-action

### Authentication
- Sign up with email and password
- Log in / log out
- Session management via Supabase Auth
- Protected routes via Next.js middleware

### Content Management (Logged In)
- Create new articles with title, content, and visibility toggle
- Edit existing articles
- Delete articles
- Toggle articles between **Free** and **Premium**
- Toggle articles between **Published** and **Draft**
- Dashboard showing all your articles and subscription status

### Premium Subscription
- $10/month subscription via **Stripe Checkout**
- Webhook-powered subscription activation
- Premium articles unlock instantly after payment
- Subscription status shown in dashboard

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 14 (App Router) | Frontend + API routes |
| Database | Supabase (PostgreSQL) | Data storage + Auth |
| Auth | Supabase Auth | Email/password sessions |
| Payments | Stripe | Subscription billing |
| Deployment | Vercel | Hosting + CI/CD |
| Styling | Tailwind CSS | UI styling |
| Language | TypeScript | Type safety |

---

## 📁 Project Structure

```
blog-app/
├── app/
│   ├── layout.tsx                  # Root layout (Navbar + Footer)
│   ├── page.tsx                    # Homepage — hero + post listing
│   ├── globals.css                 # Global styles + Tailwind
│   ├── (auth)/
│   │   ├── layout.tsx              # Centered auth layout
│   │   ├── login/page.tsx          # Login page
│   │   └── signup/page.tsx         # Signup page
│   ├── posts/
│   │   ├── page.tsx                # All posts listing + search
│   │   └── [slug]/page.tsx         # Single post view + premium gate
│   ├── dashboard/
│   │   ├── page.tsx                # My posts + subscription status
│   │   ├── new/page.tsx            # Create post form
│   │   └── edit/[id]/page.tsx      # Edit post form
│   ├── subscribe/
│   │   ├── page.tsx                # Pricing page + checkout button
│   │   ├── success/page.tsx        # Post-payment success screen
│   │   └── cancel/page.tsx         # Cancelled checkout screen
│   └── api/
│       ├── posts/route.ts          # GET list, POST create
│       ├── posts/[id]/route.ts     # GET one, PATCH, DELETE
│       ├── checkout/route.ts       # POST → create Stripe session
│       └── webhooks/stripe/route.ts # POST → handle Stripe events
├── components/
│   ├── ui/
│   │   ├── Navbar.tsx              # Sticky auth-aware navigation
│   │   ├── Footer.tsx              # Site footer
│   │   └── LoadingSpinner.tsx      # Reusable spinner
│   ├── posts/
│   │   ├── PostCard.tsx            # Article preview card
│   │   ├── PostList.tsx            # Maps over posts array
│   │   ├── PostForm.tsx            # Create + edit form (dual mode)
│   │   ├── PostContent.tsx         # Renders article body
│   │   ├── PremiumGate.tsx         # Blur overlay + subscribe CTA
│   │   └── SearchBar.tsx           # URL-based search input
│   └── auth/
│       ├── LoginForm.tsx           # Login with show/hide password
│       └── SignupForm.tsx          # Signup with password strength bar
├── hooks/
│   ├── useUser.ts                  # Current auth session hook
│   └── useSubscription.ts         # Active subscription hook + realtime
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   └── server.ts               # Server Supabase client (cookies)
│   ├── stripe.ts                   # Stripe SDK + helper functions
│   └── utils.ts                    # slugify, formatDate, getExcerpt, etc.
├── types/
│   └── index.ts                    # Post, Profile, Subscription interfaces
├── supabase/
│   └── migrations/
│       ├── 001_create_profiles.sql
│       ├── 002_create_posts.sql
│       ├── 003_create_subscriptions.sql
│       └── 004_seed_posts.sql      # 20 sample articles
├── middleware.ts                   # Auth guard + session refresh
├── .env.example                    # Environment variable template
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- A [Supabase](https://supabase.com) account (free)
- A [Stripe](https://stripe.com) account (free test mode)
- [Stripe CLI](https://stripe.com/docs/stripe-cli) (for local webhook testing)

### 1. Clone the repository

```bash
git clone https://github.com/matheesha2000/BlogSphere.git
cd BlogSphere
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in all values (see Environment Variables section below).

### 4. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and copy your URL and keys
3. Go to **SQL Editor** and run each migration file in order:

```sql
-- Run these one at a time in Supabase SQL Editor
-- supabase/migrations/001_create_profiles.sql
-- supabase/migrations/002_create_posts.sql
-- supabase/migrations/003_create_subscriptions.sql
-- supabase/migrations/004_seed_posts.sql  (replace YOUR_USER_ID_HERE first)
```

### 5. Set up Stripe

1. Create a product in [Stripe dashboard](https://dashboard.stripe.com) → **Products → Add product**
2. Set a recurring monthly price ($9.00)
3. Copy the **Price ID** (`price_xxx`) to `NEXT_PUBLIC_STRIPE_PRICE_ID` in `.env.local`

### 6. Run the development server

```bash
npm run dev
```

### 7. Run Stripe webhooks locally

In a second terminal:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_xxx` signing secret to `STRIPE_WEBHOOK_SECRET` in `.env.local`.

Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔑 Environment Variables

```bash
# Supabase — Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...       # Never expose to browser


# Stripe — Developers → API Keys
STRIPE_SECRET_KEY=sk_test_xxx                  # Never expose to browser
STRIPE_WEBHOOK_SECRET=whsec_xxx                # Never expose to browser
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
NEXT_PUBLIC_STRIPE_PRICE_ID=price_xxx

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000     # Change to Vercel URL in prod
```

---

## 💳 Test Stripe Payments

Use these test card details — never a real card:

| Field | Value |
|---|---|
| Card number | `4242 4242 4242 4242` |
| Expiry | Any future date |
| CVC | Any 3 digits |
| ZIP | Any 5 digits |

---

## 🗄 Database Schema

### `profiles`
| Column | Type | Description |
|---|---|---|
| id | UUID | References auth.users |
| email | text | User email |
| full_name | text | Display name shown on posts |
| avatar_url | text | Profile image URL |
| created_at | timestamptz | Auto-set on creation |

### `posts`
| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| title | text | Article headline |
| content | text | Full article body |
| excerpt | text | Auto-generated preview |
| slug | text | URL-friendly unique identifier |
| is_premium | boolean | true = subscribers only |
| published | boolean | false = draft (hidden) |
| user_id | UUID | Author — references auth.users |
| created_at | timestamptz | Publication date |
| updated_at | timestamptz | Auto-updated on edit |

### `subscriptions`
| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | References auth.users |
| stripe_customer_id | text | Stripe customer object ID |
| stripe_subscription_id | text | Stripe subscription ID |
| status | text | active / canceled / past_due |
| price_id | text | Stripe price ID |
| current_period_end | timestamptz | Subscription renewal date |

---

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Add all environment variables from `.env.local` in Vercel project settings
4. Change `NEXT_PUBLIC_SITE_URL` to your Vercel URL
5. Click **Deploy**

### Register Stripe Webhook (Production)

After deploying, go to **Stripe → Developers → Webhooks → Add endpoint**:

```
URL:    https://blog-sphere.vercel.app/api/webhooks/stripe
Events: checkout.session.completed
        customer.subscription.updated
        customer.subscription.deleted
```

Copy the new signing secret and update `STRIPE_WEBHOOK_SECRET` in Vercel environment variables.

---

## ✅ Completed Features

- [x] User authentication (signup, login, logout)
- [x] Protected routes via middleware
- [x] Public post listing with search
- [x] Single post view page
- [x] Post creation, editing, and deletion
- [x] Free / premium visibility toggle
- [x] Published / draft toggle
- [x] Stripe checkout session
- [x] Stripe webhook handler
- [x] Premium content gate (PremiumGate component)
- [x] Real-time subscription status updates
- [x] Author name displayed on posts
- [x] Responsive design (mobile + desktop)


## 🔜 Pending / Not Implemented

- [ ] Password reset flow
- [ ] Profile editing page
- [ ] Cancel subscription button in dashboard
- [ ] Image uploads for posts (Supabase Storage)
- [ ] Comments section
- [ ] Email notifications

---

## 👤 Author

**Your Name Here**
GitHub: [@matheesha2000](https://github.com/matheesha2000)

---

## 📄 License

MIT