interface PostContentProps {
  content: string
}

// Simple whitespace-preserving content renderer
// For a real app, swap this for react-markdown or @tailwindcss/typography
export default function PostContent({ content }: PostContentProps) {
  return (
    <div className="prose max-w-none text-gray-800 leading-relaxed">
      {content.split('\n').map((line, i) => {
        if (line.startsWith('# ')) {
          return <h1 key={i} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{line.slice(2)}</h1>
        }
        if (line.startsWith('## ')) {
          return <h2 key={i} className="text-xl font-semibold text-gray-900 mt-6 mb-3">{line.slice(3)}</h2>
        }
        if (line.startsWith('### ')) {
          return <h3 key={i} className="text-lg font-semibold text-gray-900 mt-5 mb-2">{line.slice(4)}</h3>
        }
        if (line.trim() === '') {
          return <br key={i} />
        }
        return (
          <p key={i} className="mb-4 text-gray-700 leading-7">
            {line}
          </p>
        )
      })}
    </div>
  )
}