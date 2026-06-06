import PostForm from '@/components/posts/PostForm'
import Link from 'next/link'

export const metadata = { title: 'New Article — BlogSphere' }

export default function NewPostPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← Dashboard
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-900 font-medium">New Article</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Write a new article</h1>
      <PostForm mode="create" />
    </div>
  )
}