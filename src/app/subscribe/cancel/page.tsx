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
      <div className="flex gap-3 justify-center">
        <Link
          href="/subscribe"
          className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Try again
        </Link>
        <Link
          href="/posts"
          className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          Browse free posts
        </Link>
      </div>
    </div>
  )
}