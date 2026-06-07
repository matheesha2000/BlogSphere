import { createClient } from '@/lib/supabase/server'
import PostList from '@/components/posts/PostList'
import SearchBar from '@/components/posts/Searchbar'
import Link from 'next/link'

interface Post {
  id: string
  slug: string
  title: string
  content: string
  created_at: string
  author_name?: string | null
}

interface HomePageProps {
  searchParams: Promise<{ q?: string }>
}

// ── Stats data ──────────────────────────────────────────
const STATS = [
  { value: '10K+', label: 'Articles Published' },
  { value: '50K+', label: 'Monthly Readers' },
  { value: '2K+',  label: 'Active Writers' },
  { value: '99%',  label: 'Satisfaction Rate' },
]

// ── Feature cards ───────────────────────────────────────
const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Rich Reading Experience',
    desc: 'Beautifully typeset articles with syntax highlighting, code blocks, and responsive images.',
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Lightning Fast',
    desc: 'Server-side rendering and edge caching deliver sub-second load times worldwide.',
    gradient: 'from-violet-500 to-purple-400',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Premium Access',
    desc: 'Subscribe for exclusive content, ad-free reading, and early access to new features.',
    gradient: 'from-amber-500 to-orange-400',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Thriving Community',
    desc: 'Connect with thousands of curious minds — writers, engineers, and lifelong learners.',
    gradient: 'from-green-500 to-emerald-400',
  },
]

export default async function HomePage({ searchParams }: HomePageProps) {
  const supabase = await createClient()
  const { q } = await searchParams
  const query = q ?? ''

  // Fetch posts including user_id for author resolution
  let dbQuery = supabase
    .from('posts')
    .select('id, slug, title, content, excerpt, is_premium, user_id, author_name, created_at')
    .order('created_at', { ascending: false })
    .limit(3)

  if (query) {
    dbQuery = dbQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%`)
  }

  // First attempt: with published filter
  let { data: posts, error } = await (dbQuery as typeof dbQuery).eq('published', true)

  // If 'published' column is missing, retry without filter
  if (error?.code === 'PGRST204' || error?.message?.includes('published')) {
    const fallback = await dbQuery
    posts = fallback.data
    error  = fallback.error
  }

  // Fallback: zero rows with no error — published filter blocking
  if (!error && (!posts || posts.length === 0)) {
    const { data: anyPosts } = await supabase
      .from('posts')
      .select('id, slug, title, content, excerpt, is_premium, user_id, author_name, created_at')
      .order('created_at', { ascending: false })
      .limit(3)
    if (anyPosts && anyPosts.length > 0) posts = anyPosts
  }

  const postsWithAuthors = (posts ?? []).map((p) => ({
    ...p,
    authorName: p.author_name || 'Anonymous',
  }))

  return (
    <main className="min-h-screen overflow-x-hidden">

      {/* ══════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-gray-950">

        {/* Animated blob background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <div className="animate-blob animation-delay-0 absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-600 opacity-20 blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute top-20 right-10 w-[420px] h-[420px] rounded-full bg-violet-600 opacity-20 blur-3xl" />
          <div className="animate-blob animation-delay-4000 absolute bottom-10 left-1/2 w-[380px] h-[380px] rounded-full bg-indigo-500 opacity-15 blur-3xl" />

          {/* Rotating ring decoration */}
          <div className="animate-spin-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/5" />
          <div className="animate-spin-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />

          {/* Grid overlay */}
          <div className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

          {/* Badge */}
          <div className="animate-fade-up delay-100 inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Modern Blog Platform
          </div>

          {/* Heading */}
          <h1 className="animate-fade-up delay-200 text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
            Share Ideas.{' '}
            <span
              className="animate-shimmer bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg,#60a5fa,#a78bfa,#f472b6,#60a5fa)',
              }}
            >
              Inspire Readers.
            </span>
          </h1>

          {/* Sub-heading */}
          <p className="animate-fade-up delay-300 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover thoughtful, well-crafted articles from writers around the world.
            Join a community that values curiosity, depth, and clarity.
          </p>

          {/* CTA buttons */}
          <div className="animate-fade-up delay-400 flex flex-wrap gap-4 justify-center">
            <Link href="/posts">
              <button className="group relative px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Browse Articles
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                {/* shimmer overlay */}
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </Link>

            <Link href="/subscribe">
              <button className="px-8 py-3.5 rounded-2xl border border-gray-600 text-gray-300 font-semibold text-sm hover:bg-white/5 hover:border-gray-400 hover:text-white active:scale-[0.98] transition-all duration-200 cursor-pointer backdrop-blur-sm">
                Upgrade to Premium ✦
              </button>
            </Link>
          </div>

          {/* Scroll hint */}
          <div className="animate-float animate-fade-up delay-700 mt-16 flex flex-col items-center gap-2 text-gray-600">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS BAND
      ══════════════════════════════════════════════ */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label }, i) => (
            <div
              key={label}
              className={`animate-fade-up delay-${(i + 1) * 100} text-center`}
            >
              <p className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                {value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURES SECTION
      ══════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">
              Why BlogSphere
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Everything you need to read &amp; write
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm md:text-base">
              A platform built for people who believe words matter.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map(({ icon, title, desc, gradient }, i) => (
              <div
                key={title}
                className={`animate-fade-up delay-${(i + 1) * 100} group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  {icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SEARCH + ARTICLES SECTION
      ══════════════════════════════════════════════ */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-violet-600">
                Latest
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                {query ? `Results for "${query}"` : 'Recent Articles'}
              </h2>
            </div>
            <Link href="/posts">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 group transition-colors">
                View all articles
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </Link>
          </div>

          {/* Search bar */}
          <div className="mb-10 bg-gray-50 rounded-2xl border border-gray-100 p-5 shadow-sm">
            <SearchBar defaultValue={query} />
          </div>

          {/* Result count */}
          {query && (
            <p className="text-sm text-gray-400 mb-6">
              Found <strong className="text-gray-700">{postsWithAuthors.length || 0}</strong>{' '}
              result{postsWithAuthors.length !== 1 ? 's' : ''} for &quot;{query}&quot;
            </p>
          )}

          {/* Posts grid */}
          {error ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">Failed to load articles. Please try again later.</p>
            </div>
          ) : postsWithAuthors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {postsWithAuthors.map((post, i) => (
                <div
                  key={post.id}
                  className={`animate-fade-up delay-${Math.min((i + 1) * 100, 600)}`}
                >
                  <PostList post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">
                {query ? 'No articles matched your search.' : 'No articles published yet.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gray-950 py-20 px-6">
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="animate-blob absolute -top-20 -right-20 w-80 h-80 rounded-full bg-violet-700 opacity-20 blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute -bottom-10 -left-20 w-72 h-72 rounded-full bg-blue-700 opacity-20 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">
            Premium
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Take your reading to the next level
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Unlock exclusive articles, ad-free browsing, and early access to new features
            with a BlogSphere Premium membership.
          </p>
          <Link href="/subscribe">
            <button className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer">
              Get Premium Access ✦
            </button>
          </Link>
        </div>
      </section>

    </main>
  )
}