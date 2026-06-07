import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { slugify } from '@/lib/Utils'

// Helper: probe the posts table schema to see which columns exist
async function getPostsColumns(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase
    .from('posts')
    .select()
    .limit(0)   // fetch no rows — just the schema
  // Supabase returns column info via a zero-row select
  return data
}

// GET /api/posts — list published posts (with optional ?q= search)
export async function GET(request: Request) {
  const supabase = await createClient()

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  // Try with published filter first; fall back to all posts if column missing
  let dbQuery = supabase
    .from('posts')
    .select('id, slug, title, content, excerpt, is_premium, published, user_id, created_at')
    .order('created_at', { ascending: false })

  // Only add .eq('published', true) — if the column doesn't exist yet,
  // return all posts rather than crash
  const testFilter = supabase
    .from('posts')
    .select('published')
    .limit(1)

  const { error: colError } = await testFilter
  if (!colError) {
    // Column exists — filter to published only
    dbQuery = dbQuery.eq('published', true) as typeof dbQuery
  }

  if (query) {
    dbQuery = dbQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%`)
  }

  const { data, error } = await dbQuery

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/posts — create a new post
export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, content, is_premium, published } = body

  if (!title?.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }

  if (!content?.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 })
  }

  const excerpt = content
    .replace(/[#*`>\-]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .substring(0, 150)

  const slug = slugify(title)

  // Always-present columns (guaranteed to exist)
  const insertPayload: Record<string, unknown> = {
    title,
    content,
    excerpt,
    slug,
    user_id: user.id,
  }

  // Conditionally probe and add optional columns
  const { error: pubColError } = await supabase
    .from('posts').select('published').limit(1)
  if (!pubColError) {
    insertPayload.published = typeof published === 'boolean' ? published : true
  }

  const { error: premColError } = await supabase
    .from('posts').select('is_premium').limit(1)
  if (!premColError) {
    insertPayload.is_premium = typeof is_premium === 'boolean' ? is_premium : false
  }

  const { error: authorNameColError } = await supabase
    .from('posts').select('author_name').limit(1)
  if (!authorNameColError) {
    insertPayload.author_name = user.user_metadata?.full_name || user.email || 'Anonymous'
  }

  const { data, error } = await supabase
    .from('posts')
    .insert(insertPayload)
    .select()
    .single()

  if (error) {
    console.error('[POST /api/posts] Supabase error:', {
      message: error.message,
      details: error.details,
      hint:    error.hint,
      code:    error.code,
    })
    return NextResponse.json(
      { error: error.message, hint: error.hint },
      { status: 500 }
    )
  }

  return NextResponse.json(data, { status: 201 })
}