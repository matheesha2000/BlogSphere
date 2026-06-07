import Link from 'next/link'

export const metadata = { title: 'Checkout cancelled — BlogApp' }

export default function SubscribeCancelPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="animate-blob absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl" />
        {/* Grid overlay */}
        <div className="absolute inset-0 animate-grid-scroll"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md text-center animate-fade-up">
        {/* Glassmorphic card */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 sm:p-10 text-center">
          <div className="text-5xl mb-6">👋</div>
          <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight">No problem</h1>
          <p className="text-gray-300 mb-8">
            You cancelled the checkout. You can subscribe anytime to unlock premium content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
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
      </div>
    </div>
  )
}