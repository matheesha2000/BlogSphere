import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/Utils'
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
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params,
}: PostPageProps) {
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
    title: `${post.title} — BlogApp`,
    description:
      post.excerpt ||
      post.content?.substring(0, 150) ||
      '',
  }
}

export default async function PostPage({
  params,
}: PostPageProps) {
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*, profiles(id, email, full_name)')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

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

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/posts"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
      >
        ← Back to posts
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          {typedPost.is_premium && (
            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full">
              ★ Premium
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
          {typedPost.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>
            {typedPost.profiles?.full_name ||
              typedPost.profiles?.email ||
              'Anonymous'}
          </span>

          <span>·</span>

          <time>
            {formatDate(typedPost.created_at)}
          </time>
        </div>
      </div>

      <hr className="border-gray-200 mb-8" />

      {typedPost.is_premium && !isSubscribed ? (
        <PremiumGate content={typedPost.content ?? ''} />
      ) : (
        <PostContent content={typedPost.content ?? ''} />
      )}
    </div>
  )
}