'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Post } from '@/types'

interface PostFormProps {
  mode: 'create' | 'edit'
  post?: Post
}

export default function PostForm({ mode, post }: PostFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(post?.title || '')
  const [content, setContent] = useState(post?.content || '')
  const [isPremium, setIsPremium] = useState(post?.is_premium || false)
  const [published, setPublished] = useState(post?.published ?? true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) { setError('Title is required'); return }
    if (!content.trim()) { setError('Content is required'); return }

    setLoading(true)

    try {
      const url = mode === 'edit' ? `/api/posts/${post!.id}` : '/api/posts'
      const method = mode === 'edit' ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, is_premium: isPremium, published }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return

    setDeleting(true)
    try {
      await fetch(`/api/posts/${post!.id}`, { method: 'DELETE' })
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Failed to delete post')
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Your post title"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1.5">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content here… You can use # for headings, ## for subheadings."
          rows={16}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none font-mono leading-relaxed"
        />
        <p className="text-xs text-gray-400 mt-1">{content.length} characters</p>
      </div>

      {/* Toggles */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-4">
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm font-medium text-gray-900">Premium content</p>
            <p className="text-xs text-gray-500">Only subscribers can read this post</p>
          </div>
          <button
            type="button"
            onClick={() => setIsPremium(!isPremium)}
            className={`relative w-10 h-5.5 rounded-full transition-colors ${isPremium ? 'bg-gray-900' : 'bg-gray-300'}`}
            style={{ width: '40px', height: '22px' }}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isPremium ? 'translate-x-4.5' : ''}`}
              style={{ transform: isPremium ? 'translateX(18px)' : 'translateX(0)' }}
            />
          </button>
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm font-medium text-gray-900">Published</p>
            <p className="text-xs text-gray-500">Visible to readers</p>
          </div>
          <button
            type="button"
            onClick={() => setPublished(!published)}
            className={`relative rounded-full transition-colors`}
            style={{ width: '40px', height: '22px', background: published ? '#111827' : '#D1D5DB' }}
          >
            <span
              className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
              style={{ transform: published ? 'translateX(18px)' : 'translateX(0)' }}
            />
          </button>
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving…' : mode === 'create' ? 'Publish article' : 'Save changes'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>

        {mode === 'edit' && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {deleting ? 'Deleting…' : 'Delete post'}
          </button>
        )}
      </div>
    </form>
  )
}