import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatDate, readingTime } from '@/lib/Utils'
import PremiumGate from '@/components/posts/PremiumGate'
import PostContent from '@/components/posts/PostContent'
import Link from 'next/link'

interface Post {
  id: string
  slug: string
  title: string
  excerpt?: string | null
  content?: string | null
  is_premium: boolean
  published: boolean
  created_at: string
  profiles?: {
    id: string
    email: string
    full_name: string | null
  }
}

interface PostPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PostPageProps) {
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt, content')
    .eq('slug', params.slug)
    .single()

  if (!post) {
    return {
      title: 'Post not found',
    }
  }

  return {
    title: `${post.title} — BlogSphere`,
    description: post.excerpt || post.content?.substring(0, 150) || '',
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const supabase = await createClient()

  const dbQuery = supabase
    .from('posts')
    .select('*, profiles(id, email, full_name)')
    .eq('slug', params.slug)

  // First attempt: with published filter
  const {
    data: initialPost,
    error,
  } = await dbQuery.eq('published', true).single()

  let post = initialPost

  // If 'published' column is missing, retry without filter
  if (error?.code === 'PGRST204' || error?.message?.includes('published')) {
    const fallback = await dbQuery.single()
    post = fallback.data
  }

  if (!post) {
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isSubscribed = false

  if (user && post.is_premium) {
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    isSubscribed = !!sub
  }

  const typedPost = post as Post
  const author =
    typedPost.profiles?.full_name ||
    typedPost.profiles?.email ||
    'Anonymous'

  const avatarLetter = author[0].toUpperCase()
  const readTime = readingTime(typedPost.content ?? '')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Article hero ────────────────────────────────── */}
      <div className="relative bg-white border-b border-gray-100 overflow-hidden">
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />

        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Back link */}
          <Link
            href="/posts"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-8 transition-colors group animate-fade-up"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            Back to articles
          </Link>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-5 animate-fade-up delay-100">
            {typedPost.is_premium && (
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm shadow-amber-200">
                ✦ Premium
              </span>
            )}

            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {readTime}
            </span>
          </div>

          {/* Title */}
          <h1 className="animate-fade-up delay-200 text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
            {typedPost.title}
          </h1>

          {/* Author + date row */}
          <div className="animate-fade-up delay-300 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {avatarLetter}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900">
                {author}
              </p>

              <p className="text-xs text-gray-400">
                <time>{formatDate(typedPost.created_at)}</time>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Article body ────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Excerpt banner */}
          {typedPost.excerpt && (
            <div className="px-8 py-5 border-b border-gray-100 bg-blue-50/40">
              <p className="text-gray-600 text-base leading-relaxed italic">
                {typedPost.excerpt}
              </p>
            </div>
          )}

          {/* Content */}
          <div className="px-8 py-8">
            {typedPost.is_premium && !isSubscribed ? (
              <PremiumGate content={typedPost.content ?? ''} />
            ) : (
              <PostContent content={typedPost.content ?? ''} />
            )}
          </div>
        </div>

        {/* Footer navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Link href="/posts">
            <button className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-white transition-all cursor-pointer">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              All articles
            </button>
          </Link>

          {typedPost.is_premium && !isSubscribed && (
            <Link href="/subscribe">
              <button className="inline-flex items-center gap-2 text-sm text-white font-semibold px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:scale-[1.03] transition-transform cursor-pointer shadow-md shadow-violet-200">
                Unlock Premium ✦
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}