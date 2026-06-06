import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface Params {
  params: { id: string }
}

// GET /api/posts/[id]
export async function GET(
  _request: Request,
  { params }: Params
) {
  const supabase = await createClient() // FIX

  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(id, email, full_name)')
    .eq('id', params.id)
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(data)
}

// PATCH /api/posts/[id] — update a post (owner only)
export async function PATCH(
  request: Request,
  { params }: Params
) {
  const supabase = await createClient() // FIX

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const body = await request.json()
  const {
    title,
    content,
    is_premium,
    published,
  } = body

  const { data, error } = await supabase
    .from('posts')
    .update({
      title,
      content,
      is_premium,
      published,
    })
    .eq('id', params.id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  if (!data) {
    return NextResponse.json(
      {
        error:
          'Post not found or not authorized',
      },
      { status: 404 }
    )
  }

  return NextResponse.json(data)
}

// DELETE /api/posts/[id] — delete a post (owner only)
export async function DELETE(
  _request: Request,
  { params }: Params
) {
  const supabase = await createClient() // FIX

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}