import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/Utils'
import type { Post } from '@/types'

export const metadata = { title: 'Dashboard — BlogSphere' }

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('user_id', user.id)
    .maybeSingle()

  const publishedCount = posts?.filter(p => p.published).length ?? 0
  const draftCount     = posts?.filter(p => !p.published).length ?? 0
  const premiumCount   = posts?.filter(p => p.is_premium).length ?? 0
  const fullName       = user.user_metadata?.full_name || user.email || 'Anonymous'
  const avatarLetter   = fullName[0].toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero header ────────────────────────────────── */}
      <div className="relative bg-gray-950 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="animate-blob absolute -top-20 -left-20 w-72 h-72 rounded-full bg-blue-700 opacity-20 blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute top-10 right-10 w-64 h-64 rounded-full bg-violet-700 opacity-20 blur-3xl" />
          <div className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            {/* Avatar + info */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/30 shrink-0">
                {avatarLetter}
              </div>
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-0.5">
                  Welcome back
                </p>
                <h1 className="text-white text-xl font-bold truncate max-w-xs">
                  {fullName}
                </h1>
              </div>
            </div>

            {/* New post button */}
            <Link href="/dashboard/new">
              <button className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden">
                <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Article
              </button>
            </Link>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              { label: 'Published', value: publishedCount, color: 'from-green-500 to-emerald-400' },
              { label: 'Drafts',    value: draftCount,     color: 'from-amber-500 to-orange-400' },
              { label: 'Premium Articles', value: premiumCount, color: 'from-violet-500 to-purple-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className={`text-2xl font-extrabold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                  {value}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* Subscription card */}
        <div className={`rounded-2xl p-5 border ${
          subscription?.status === 'active'
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
            : 'bg-white border-gray-200'
        } shadow-sm`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                subscription?.status === 'active'
                  ? 'bg-green-100'
                  : 'bg-gray-100'
              }`}>
                <svg className={`w-5 h-5 ${subscription?.status === 'active' ? 'text-green-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {subscription?.status === 'active' ? 'Premium Active' : 'Free Plan'}
                </p>
                <p className="text-xs text-gray-500">
                  {subscription?.status === 'active'
                    ? `Renews ${subscription.current_period_end ? formatDate(subscription.current_period_end) : 'soon'}`
                    : 'Upgrade to unlock premium features'}
                </p>
              </div>
            </div>

            {subscription?.status !== 'active' && (
              <Link href="/subscribe">
                <button className="text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:scale-[1.04] transition-transform cursor-pointer">
                  Go Premium ✦
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Articles section */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">
              Your Articles
              <span className="ml-2 text-sm font-normal text-gray-400">({posts?.length ?? 0})</span>
            </h2>
          </div>

          {!posts?.length ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium mb-1">No articles yet</p>
              <p className="text-gray-400 text-sm mb-5">Share your first idea with the world</p>
              <Link href="/dashboard/new">
                <button className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Write first article
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {(posts ?? [] as Post[]).map((post, i) => (
                <div
                  key={post.id}
                  className="animate-fade-up group bg-white rounded-2xl border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gray-200 hover:shadow-md transition-all duration-200"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="min-w-0 flex-1 w-full">
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      {post.is_premium && (
                        <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">
                          ✦ Premium
                        </span>
                      )}
                      {post.published ? (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">
                          <span className="w-1 h-1 rounded-full bg-green-500" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-500 font-medium px-2 py-0.5 rounded-full">
                          <span className="w-1 h-1 rounded-full bg-gray-400" />
                          Draft
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(post.created_at)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0 w-full sm:w-auto justify-end border-t border-gray-50 pt-3 sm:border-0 sm:pt-0">
                    <Link href={`/posts/${post.slug}`}>
                      <button className="text-xs text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg transition-all cursor-pointer hover:bg-gray-50">
                        View
                      </button>
                    </Link>
                    <Link href={`/dashboard/edit/${post.id}`}>
                      <button className="text-xs text-white bg-gray-900 hover:bg-gray-700 font-medium px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                        Edit
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}