import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import PostForm from '@/components/posts/PostForm'
import Link from 'next/link'
import type { Post } from '@/types'

interface EditPostPageProps {
  params: Promise<{
    id: string
  }>
}

export const metadata = {
  title: 'Edit Article — BlogSphere',
}

export default async function EditPostPage({
  params,
}: EditPostPageProps) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!post) {
    notFound()
  }

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

        <span className="text-sm text-gray-900 font-medium">
          Edit Article
        </span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Edit Article
      </h1>

      <PostForm
        mode="edit"
        post={post as Post}
      />
    </div>
  )
}
