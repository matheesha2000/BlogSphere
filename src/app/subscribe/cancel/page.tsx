import Link from 'next/link'

export const metadata = { title: 'Checkout cancelled — BlogApp' }

export default function SubscribeCancelPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="text-5xl mb-6">👋</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">No problem</h1>
      <p className="text-gray-500 mb-8">
        You cancelled the checkout. You can subscribe anytime to unlock premium content.
      </p>
      <div className="flex gap-4 justify-center mt-8">
        <Link
          href="/subscribe"
          className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          Try again
        </Link>
        <Link
          href="/posts"
          className="inline-flex items-center justify-center border border-white/10 bg-white/5 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          Browse free posts
        </Link>
      </div>
    </div>
  )
}