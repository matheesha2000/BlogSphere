import Link from 'next/link'
import { formatDate, getExcerpt } from '@/lib/Utils'
import type { Post } from '@/types'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const profile = post.profiles

  return (
    <Link href={`/posts/${post.slug}`} className="block group">
      <article className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              {post.is_premium && (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  ★ Premium
                </span>
              )}
            </div>

            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors mb-2 leading-snug">
              {post.title}
            </h2>

            <p className="text-sm text-gray-500 line-clamp-2 mb-4">
              {post.excerpt || getExcerpt(post.content ?? '')}
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>
                {profile?.full_name || profile?.email || 'Anonymous'}
              </span>
              <span>·</span>
              <time>{formatDate(post.created_at)}</time>
            </div>
          </div>

          <span className="text-gray-300 group-hover:text-gray-500 transition-colors mt-1 shrink-0">
            →
          </span>
        </div>
      </article>
    </Link>
  )
}