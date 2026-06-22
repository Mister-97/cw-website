import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { articles, getArticle, type Block } from '@/lib/articles'

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return {}
  return {
    title: article.metaTitle,
    description: article.description,
    alternates: { canonical: `https://cwsoundlab.com/blog/${slug}` },
    openGraph: {
      title: article.metaTitle,
      description: article.description,
      url: `https://cwsoundlab.com/blog/${slug}`,
      type: 'article',
    },
  }
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case 'h2':
      return <h2 key={i} className="font-heading text-2xl text-black mb-3 mt-10 leading-tight">{block.text}</h2>
    case 'h3':
      return <h3 key={i} className="font-heading text-lg text-black mb-2 mt-6">{block.text}</h3>
    case 'p':
      return <p key={i} className="font-body text-gray-700 leading-relaxed mb-5 text-base">{block.text}</p>
    case 'ul':
      return (
        <ul key={i} className="list-disc list-outside ml-5 space-y-2 mb-5">
          {block.items.map((item, j) => (
            <li key={j} className="font-body text-gray-700 text-base leading-relaxed">{item}</li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol key={i} className="list-decimal list-outside ml-5 space-y-2 mb-5">
          {block.items.map((item, j) => (
            <li key={j} className="font-body text-gray-700 text-base leading-relaxed">{item}</li>
          ))}
        </ol>
      )
    case 'tip':
      return (
        <div key={i} className="bg-zinc-50 border-l-4 border-cw-red px-5 py-4 mb-5">
          <p className="font-body text-gray-700 text-sm leading-relaxed italic">{block.text}</p>
        </div>
      )
    default:
      return null
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black pt-32 pb-14 px-4">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block font-heading text-[10px] tracking-widest uppercase text-cw-red mb-4">
            {article.category}
          </span>
          <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight mb-5">
            {article.title}
          </h1>
          <div className="flex items-center gap-4">
            <span className="font-body text-white/30 text-xs">{article.date}</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span className="font-body text-white/30 text-xs">{article.readTime}</span>
          </div>
        </div>
      </div>
      <div className="h-1.5 bg-cw-red" />

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 py-14">
        {article.body.map((block, i) => renderBlock(block, i))}
      </div>

      {/* CTA */}
      <div className="bg-black border-t-4 border-cw-red py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-heading text-xs tracking-widest uppercase text-cw-red mb-4">Book Today</p>
          <h2 className="font-heading text-4xl md:text-5xl text-white leading-none mb-4">
            Ready to Record?
          </h2>
          <p className="font-body text-white/40 text-sm leading-relaxed mb-8">
            CW Soundlab is Chicago's number one recording studio. Sessions start at $65, open 8AM to 2AM, seven days a week in Chicago, IL.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking" className="bg-cw-red hover:bg-white hover:text-black text-white font-heading text-xs px-10 py-4 tracking-widest uppercase transition-colors">
              Book a Session
            </Link>
            <Link href="/services" className="border-2 border-white/20 hover:border-white text-white/60 hover:text-white font-heading text-xs px-10 py-4 tracking-widest uppercase transition-colors">
              View Services
            </Link>
          </div>
          <Link href="/blog" className="inline-block mt-8 font-heading text-xs text-white/30 hover:text-white tracking-widest uppercase transition-colors">
            Back to Blog
          </Link>
        </div>
      </div>
    </div>
  )
}
