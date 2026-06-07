import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PostCard from '@/components/posts/PostCard'
import SearchBar from '@/components/posts/Searchbar'

interface Post {
  id: string
  slug: string
  title: string
  excerpt?: string | null
  content?: string | null
  is_premium: boolean
  user_id?: string
  author_name?: string | null
  created_at: string
}

interface PostsPageProps {
  searchParams: Promise<{ q?: string }>
}

export const metadata = { title: 'All Posts — BlogSphere' }


export default async function PostsPage({ searchParams }: PostsPageProps) {
  const supabase = await createClient()
  const { q } = await searchParams
  const query = q?.trim() || ''

  // Fetch posts (server-side ilike search)
  let dbQuery = supabase
    .from('posts')
    .select('id, slug, title, excerpt, content, is_premium, user_id, author_name, created_at')
    .order('created_at', { ascending: false })
    .eq('published', true)

  if (query) {
    dbQuery = dbQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%`)
  }

  let { data: posts, error } = await dbQuery

  // Fallback 1: `published` column missing in schema
  if (error?.code === 'PGRST204' || error?.message?.includes('published')) {
    let fallbackQuery = supabase
      .from('posts')
      .select('id, slug, title, excerpt, content, is_premium, user_id, author_name, created_at')
      .order('created_at', { ascending: false })
    if (query) fallbackQuery = fallbackQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    const fallback = await fallbackQuery
    posts = fallback.data
    error  = fallback.error
  }

  // Fallback 2: zero rows with no error — published filter blocking
  if (!error && (!posts || posts.length === 0)) {
    const { data: anyPosts } = await supabase
      .from('posts')
      .select('id, slug, title, excerpt, content, is_premium, user_id, author_name, created_at')
      .order('created_at', { ascending: false })
    if (anyPosts && anyPosts.length > 0) {
      posts = query
        ? anyPosts.filter(
            (p) =>
              p.title?.toLowerCase().includes(query.toLowerCase()) ||
              p.content?.toLowerCase().includes(query.toLowerCase())
          )
        : anyPosts
    }
  }

  const postsWithAuthors = (posts ?? []).map((p) => ({
    ...p,
    authorName: p.author_name || 'Anonymous',
  }))
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Page header ─────────────────────────────────── */}
      <div className="relative bg-white border-b border-gray-100 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60" />

        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="animate-fade-up">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">
              BlogSphere
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              All Articles
            </h1>
            <p className="text-gray-500 text-sm">
              {postsWithAuthors.length
                ? `${postsWithAuthors.length} article${postsWithAuthors.length !== 1 ? 's' : ''} available`
                : 'Discover curated, insightful writing'}
            </p>
          </div>

          {/* Search */}
          <div className="mt-6 animate-fade-up delay-100">
            <SearchBar defaultValue={query} />
          </div>

          {query && (
            <p className="mt-3 text-sm text-gray-400 animate-fade-up delay-200">
              <span className="font-medium text-gray-700">{postsWithAuthors.length || 0}</span>{' '}
              result{postsWithAuthors.length !== 1 ? 's' : ''} for &quot;{query}&quot;
            </p>
          )}
        </div>
      </div>

      {/* ── Articles grid ────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {postsWithAuthors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {postsWithAuthors.map((post, i) => (
              <div
                key={post.slug}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <PostCard post={post as unknown as (typeof post & { author: string })} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">
              {query ? 'No articles matched your search.' : 'No articles published yet.'}
            </p>
            {query && (
              <Link href="/posts" className="text-sm text-blue-600 hover:underline">
                Clear search
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}