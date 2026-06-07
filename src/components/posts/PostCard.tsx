import Link from 'next/link'
import { formatDate, getExcerpt } from '@/lib/Utils'
import type { Post } from '@/types'

interface PostCardProps {
  post: Post & { authorName?: string; authorId?: string }
}

export default function PostCard({ post }: PostCardProps) {
  const isPremium = !!post.is_premium
  const excerpt = post.excerpt || getExcerpt(post.content ?? '')
  const authorName = post.authorName && post.authorName !== 'Anonymous' ? post.authorName : null
  const authorInitial = authorName ? authorName[0].toUpperCase() : null

  return (
    <Link href={`/posts/${post.slug}`} className="block group h-full">
      <article className={`
        relative flex flex-col h-full rounded-2xl border overflow-hidden
        transition-all duration-300 hover:shadow-xl hover:-translate-y-1
        ${isPremium
          ? 'bg-gradient-to-b from-amber-50 to-white border-amber-200 hover:border-amber-300 hover:shadow-amber-100'
          : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-blue-50'}
      `}>

        {/* Top accent bar */}
        <div className={`h-1 w-full ${
          isPremium
            ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400'
            : 'bg-gradient-to-r from-blue-500 to-violet-500'
        }`} />

        <div className="flex flex-col flex-1 p-6">

          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            {isPremium ? (
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm shadow-amber-200">
                ✦ Premium
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1 rounded-full">
                ✓ Free
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className={`text-lg font-bold leading-snug mb-3 line-clamp-2 transition-colors ${
            isPremium ? 'text-gray-900 group-hover:text-amber-700' : 'text-gray-900 group-hover:text-blue-700'
          }`}>
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed flex-1 mb-5">
            {excerpt || 'No preview available.'}
          </p>

          {/* Premium lock hint */}
          {isPremium && (
            <div className="flex items-center gap-1.5 text-xs text-amber-600 mb-4 p-2.5 bg-amber-50 rounded-xl border border-amber-100">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Requires premium subscription
            </div>
          )}

          {/* Author + date */}
          <div className={`flex items-center pt-4 border-t border-gray-100 mt-auto ${authorName ? 'justify-between' : 'justify-start'}`}>
            {authorName && (
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                  isPremium ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-blue-500 to-violet-600'
                }`}>
                  {authorInitial}
                </div>
                <span className="text-xs font-medium text-gray-700 truncate">{authorName}</span>
              </div>
            )}
            <time className="text-xs text-gray-400 shrink-0">{formatDate(post.created_at)}</time>
          </div>
        </div>

        {/* Read more CTA */}
        <div className={`px-6 py-3 border-t text-xs font-semibold flex items-center justify-between transition-colors ${
          isPremium
            ? 'border-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500'
            : 'border-gray-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600'
        }`}>
          <span>{isPremium ? 'Read Premium Article' : 'Read Article'}</span>
          <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </article>
    </Link>
  )
}