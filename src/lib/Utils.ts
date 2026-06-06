// FILE: lib/utils.ts
// ─────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS — pure helper functions used across the whole app
//
// No imports from Supabase, Stripe, or Next.js here — just plain TypeScript.
// This keeps utilities fast, testable, and free of side effects.
// ─────────────────────────────────────────────────────────────────────────


// ── slugify ───────────────────────────────────────────────────────────────
// Converts a post title into a URL-safe slug
//
// Usage:
//   slugify("Hello World!")        → "hello-world-a3f9k"
//   slugify("My Post #2 (Draft)")  → "my-post-2-draft-x7z2m"
//
// Why the random suffix?
//   Two posts can have the same title (e.g. "Introduction").
//   The 5-char random suffix keeps slugs unique without a DB lookup.
//   The slug is generated ONCE on creation and never changes.
//
export function slugify(text: string): string {
  const base = text
    .toLowerCase()                        // "Hello World" → "hello world"
    .trim()                               // remove leading/trailing whitespace
    .replace(/[^\w\s-]/g, '')            // remove special chars except - and _
    .replace(/[\s_]+/g, '-')             // spaces and underscores → hyphens
    .replace(/-+/g, '-')                 // collapse multiple hyphens → one
    .replace(/^-+|-+$/g, '')            // strip leading/trailing hyphens

  // 5-character random alphanumeric suffix for uniqueness
  const suffix = Math.random().toString(36).substring(2, 7)

  return `${base}-${suffix}`
  // e.g. "hello-world-a3f9k"
}


// ── formatDate ────────────────────────────────────────────────────────────
// Formats an ISO date string into a human-readable date
//
// Usage:
//   formatDate("2024-07-16T10:30:00Z")  → "July 16, 2024"
//   formatDate("2024-01-01")            → "January 1, 2024"
//
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  })
}


// ── formatDateShort ───────────────────────────────────────────────────────
// Shorter date format for compact UI areas (e.g. post cards)
//
// Usage:
//   formatDateShort("2024-07-16T10:30:00Z")  → "Jul 16, 2024"
//
export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'short',
    day:   'numeric',
  })
}


// ── formatRelativeDate ────────────────────────────────────────────────────
// Shows "2 days ago", "just now", "3 months ago", etc.
// Falls back to formatDateShort for dates older than 1 year
//
// Usage:
//   formatRelativeDate("2024-07-14T10:00:00Z")  → "2 days ago"  (if today is Jul 16)
//   formatRelativeDate("2024-07-16T10:29:00Z")  → "just now"
//
export function formatRelativeDate(dateString: string): string {
  const date  = new Date(dateString)
  const now   = new Date()
  const diffMs = now.getTime() - date.getTime()

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours   = Math.floor(minutes / 60)
  const days    = Math.floor(hours   / 24)
  const months  = Math.floor(days    / 30)
  const years   = Math.floor(days    / 365)

  if (seconds < 60)  return 'just now'
  if (minutes < 60)  return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  if (hours   < 24)  return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  if (days    < 30)  return `${days} day${days !== 1 ? 's' : ''} ago`
  if (months  < 12)  return `${months} month${months !== 1 ? 's' : ''} ago`
  if (years   >= 1)  return formatDateShort(dateString)   // "Jul 16, 2023"

  return formatDateShort(dateString)
}


// ── truncate ──────────────────────────────────────────────────────────────
// Cuts a string to a max length and adds "..." if truncated
// Breaks at the nearest word boundary so words aren't cut mid-way
//
// Usage:
//   truncate("Hello world this is long", 15)  → "Hello world..."
//   truncate("Short", 100)                    → "Short"
//
export function truncate(text: string, maxLength = 150): string {
  if (!text) return ''
  if (text.length <= maxLength) return text

  // Find the last space before maxLength so we don't cut a word in half
  const lastSpace = text.lastIndexOf(' ', maxLength)
  const cutAt = lastSpace > 0 ? lastSpace : maxLength

  return text.substring(0, cutAt).trim() + '…'
}


// ── getExcerpt ────────────────────────────────────────────────────────────
// Strips markdown/formatting characters from post content and returns
// a clean plain-text excerpt suitable for post cards and meta descriptions
//
// Usage:
//   getExcerpt("# Heading\n\nThis is the **body** text.", 100)
//   → "Heading This is the body text."
//
export function getExcerpt(content: string, maxLength = 150): string {
  if (!content) return ''

  const cleaned = content
    .replace(/#{1,6}\s/g, '')         // remove # ## ### headings
    .replace(/\*\*(.+?)\*\*/g, '$1') // remove **bold**
    .replace(/\*(.+?)\*/g, '$1')     // remove *italic*
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // remove `code` and ```blocks```
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // remove [links](url) → link text only
    .replace(/^[-*>]\s/gm, '')       // remove list markers and blockquotes
    .replace(/\n+/g, ' ')            // collapse newlines to spaces
    .trim()

  return truncate(cleaned, maxLength)
}


// ── classNames ────────────────────────────────────────────────────────────
// Joins class name strings together, filtering out falsy values
// A lightweight alternative to the `clsx` or `classnames` packages
//
// Usage:
//   classNames('px-4 py-2', isActive && 'bg-blue-500', undefined)
//   → "px-4 py-2 bg-blue-500"
//
export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}


// ── formatCurrency ────────────────────────────────────────────────────────
// Formats a number (in cents) as a currency string
// Stripe amounts are always in the smallest currency unit (cents)
//
// Usage:
//   formatCurrency(900)   → "$9.00"
//   formatCurrency(1999)  → "$19.99"
//
export function formatCurrency(
  amountInCents: number,
  currency = 'USD',
  locale   = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style:    'currency',
    currency: currency,
  }).format(amountInCents / 100)
}


// ── isValidEmail ──────────────────────────────────────────────────────────
// Basic email validation for client-side checks before hitting the API
//
// Usage:
//   isValidEmail("hello@example.com")  → true
//   isValidEmail("not-an-email")       → false
//
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}


// ── generateInitials ──────────────────────────────────────────────────────
// Generates 1-2 character initials from a name or email
// Used for avatar placeholders when no profile image is set
//
// Usage:
//   generateInitials("Jane Smith")        → "JS"
//   generateInitials("alice@example.com") → "A"
//   generateInitials("")                  → "?"
//
export function generateInitials(nameOrEmail: string): string {
  if (!nameOrEmail) return '?'

  // If it looks like an email, use just the first letter of the local part
  if (nameOrEmail.includes('@')) {
    return nameOrEmail[0].toUpperCase()
  }

  // Otherwise split on spaces and take first letter of first two words
  const parts = nameOrEmail.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}


// ── readingTime ───────────────────────────────────────────────────────────
// Estimates reading time for a post based on average reading speed
// Average adult reads ~200-250 words per minute
//
// Usage:
//   readingTime("word ".repeat(400))  → "2 min read"
//   readingTime("short post")         → "1 min read"
//
export function readingTime(content: string): string {
  if (!content) return '1 min read'

  const WORDS_PER_MINUTE = 225
  const wordCount = content.trim().split(/\s+/).length
  const minutes   = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE))

  return `${minutes} min read`
}