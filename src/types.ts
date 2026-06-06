// ── Shared application types ────────────────────────────────────────────────

export interface Profile {
  id?: string
  email?: string | null
  full_name?: string | null
}

/** Matches the shape returned by Supabase and consumed by PostCard */
export interface Post {
  id?: string
  slug: string
  title: string
  excerpt?: string | null
  content?: string | null
  is_premium?: boolean | null
  published?: boolean
  created_at: string
  profiles?: Profile | null
}
