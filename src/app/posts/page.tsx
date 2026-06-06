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
  created_at: string
  profiles?: {
    id: string
    email: string
    full_name: string | null
  }
}

interface PostsPageProps {
  searchParams: { q?: string }
}

export const metadata = { title: 'All Posts — BlogSphere' }

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const supabase = await createClient()
  const query = searchParams.q || ''

  let dbQuery = supabase
    .from('posts')
    .select('id, slug, title, excerpt, content, is_premium, created_at, profiles(id, email, full_name)')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (query) {
    dbQuery = dbQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%`)
  }

  const { data: posts } = await dbQuery

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All posts</h1>
        <p className="text-gray-500">Free and premium articles</p>
      </div>

      <div className="mb-6">
        <SearchBar defaultValue={query} />
      </div>

      {query && (
        <p className="text-sm text-gray-500 mb-4">
          {posts?.length || 0} result{posts?.length !== 1 ? 's' : ''} for &quot;{query}&quot;
        </p>
      )}

      {posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post as unknown as Post} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm py-10 text-center">
          {query ? 'No articles matched your search.' : 'No articles published yet.'}
        </p>
      )}
    </div>
  )
}