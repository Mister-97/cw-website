import type { Metadata } from 'next'
import Link from 'next/link'
import { articles } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Recording Studio Blog | CW Soundlab Chicago',
  description: 'Recording tips, production guides, beat licensing advice, and Chicago music scene coverage from CW Soundlab, the number one recording studio in Chicago, IL.',
  alternates: { canonical: 'https://cwsoundlab.com/blog' },
  openGraph: {
    title: 'Recording Studio Blog | CW Soundlab Chicago',
    description: 'Recording tips, production guides, and Chicago music scene coverage.',
    url: 'https://cwsoundlab.com/blog',
  },
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black pt-40 md:pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-cw-red font-heading tracking-[0.5em] uppercase text-xs mb-3">
            CW Soundlab · Chicago, IL
          </p>
          <h1 className="font-heading text-6xl md:text-7xl text-white leading-none mb-4">
            The Blog
          </h1>
          <p className="font-body text-white/40 text-sm max-w-lg">
            Recording tips, production guides, beat licensing, and everything the Chicago music scene needs to know.
          </p>
        </div>
      </div>
      <div className="h-1.5 bg-cw-red" />

      {/* Articles grid */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group border-2 border-black/10 hover:border-cw-red p-6 transition-colors duration-200 flex flex-col"
            >
              <span className="inline-block font-heading text-[10px] tracking-widest uppercase text-cw-red mb-3">
                {article.category}
              </span>
              <h2 className="font-heading text-xl text-black leading-snug mb-3 group-hover:text-cw-red transition-colors">
                {article.title}
              </h2>
              <p className="font-body text-gray-500 text-sm leading-relaxed flex-1 mb-4">
                {article.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-body text-xs text-gray-400">{article.readTime}</span>
                <span className="font-heading text-xs text-cw-red tracking-widest uppercase group-hover:underline">
                  Read More
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-black border-t-4 border-cw-red py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-heading text-xs tracking-widest uppercase text-cw-red mb-4">Book Today</p>
          <h2 className="font-heading text-4xl md:text-5xl text-white leading-none mb-4">
            Ready to Record?
          </h2>
          <p className="font-body text-white/40 text-sm leading-relaxed mb-8">
            CW Soundlab is Chicago's number one recording studio. Sessions start at $65, open 8AM to 2AM, seven days a week.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking" className="bg-cw-red hover:bg-white hover:text-black text-white font-heading text-xs px-10 py-4 tracking-widest uppercase transition-colors">
              Book a Session
            </Link>
            <Link href="/services" className="border-2 border-white/20 hover:border-white text-white/60 hover:text-white font-heading text-xs px-10 py-4 tracking-widest uppercase transition-colors">
              View Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
