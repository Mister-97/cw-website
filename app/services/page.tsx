import type { Metadata } from 'next'
import Link from 'next/link'
import { services, categories, Service } from '@/lib/services'

export const metadata: Metadata = {
  title: 'Services & Pricing | CW Soundlabs Chicago',
  description:
    'Recording sessions, custom beat production, mixing & mastering. View all packages and pricing at CW Soundlabs — Chicago.',
}

const categoryOrder: Service['category'][] = ['recording', 'production', 'post', 'content']

const categoryIcons: Record<Service['category'], string> = {
  recording: 'MIC',
  production: 'BEA',
  post: 'MIX',
  content: 'VID',
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="bg-black pt-28 pb-14 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-cw-red font-heading tracking-[0.4em] uppercase text-xs mb-5">
            CW Soundlabs · Chicago, IL
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl text-white leading-none mb-6">
            Services<br />
            <span className="text-cw-red">&amp; Pricing</span>
          </h1>
          <p className="font-body text-white/40 text-sm leading-relaxed max-w-lg">
            From quick vocal sessions to full studio days — professional sound for every artist and every budget.
            All sessions include a professional engineer.
          </p>
        </div>
      </div>
      <div className="h-2 bg-cw-red" />

      {/* ── Services ───────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-14">
        {categoryOrder.map((cat, catIdx) => {
          const catServices = services.filter((s) => s.category === cat)
          return (
            <div key={cat}>

              {/* Category header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-black text-white font-heading text-xs tracking-widest px-3 py-1.5 uppercase flex-shrink-0">
                  {categoryIcons[cat]}
                </div>
                <h2 className="font-heading text-xl text-black tracking-widest uppercase">
                  {categories[cat]}
                </h2>
                <div className="flex-1 h-px bg-black/15" />
                <span className="font-body text-xs text-gray-400">{catServices.length} services</span>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {catServices.map((service) => (
                  <div
                    key={service.id}
                    className={`group relative bg-white flex flex-col border-2 transition-all duration-200 hover:shadow-md ${
                      service.featured
                        ? 'border-cw-red'
                        : 'border-black/20 hover:border-cw-red'
                    }`}
                  >
                    {/* Top accent bar */}
                    <div className={`h-1 ${service.featured ? 'bg-cw-red' : 'bg-black/15 group-hover:bg-cw-red transition-colors'}`} />

                    <div className="p-6 flex flex-col flex-1">
                      {/* Name row */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            {service.featured && (
                              <span className="bg-cw-red text-white font-heading text-[10px] px-2 py-0.5 tracking-widest uppercase flex-shrink-0">
                                Popular
                              </span>
                            )}
                            <span className="font-heading text-[10px] text-cw-red border border-cw-red/40 px-2 py-0.5 tracking-widest uppercase flex-shrink-0">
                              {service.duration}
                            </span>
                          </div>
                          <h3 className="font-heading text-xl text-black group-hover:text-cw-red transition-colors leading-tight">
                            {service.name}
                          </h3>
                        </div>
                        {/* Price */}
                        <p className="font-heading text-3xl text-black group-hover:text-cw-red transition-colors flex-shrink-0 leading-none">
                          {service.priceNote ?? (service.price === 0 ? 'Varies' : `$${service.price}`)}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="font-body text-gray-500 text-sm leading-relaxed">
                        {service.description}
                      </p>

                      {/* Includes */}
                      {service.includes && service.includes.length > 0 && (
                        <ul className="mt-4 space-y-1.5">
                          {service.includes.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-xs text-gray-500">
                              <span className="w-1.5 h-1.5 bg-cw-red flex-shrink-0 mt-1.5 rounded-sm" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}

                      {service.bestFor && (
                        <p className="mt-3 text-xs text-gray-400">
                          <span className="font-semibold text-black">Best for:</span> {service.bestFor}
                        </p>
                      )}

                      {/* CTA */}
                      <div className="mt-auto pt-5 border-t border-black/10">
                        <Link
                          href={service.price > 0 ? `/booking?service=${service.id}` : '/booking'}
                          className={`inline-block font-heading text-xs px-6 py-2.5 tracking-widest uppercase transition-colors ${
                            service.featured
                              ? 'bg-cw-red hover:bg-black text-white'
                              : 'bg-black hover:bg-cw-red text-white'
                          }`}
                        >
                          {service.price > 0 ? 'Book Session' : 'Inquire'}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Custom CTA ─────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="bg-black overflow-hidden">
          <div className="h-1.5 bg-cw-red" />
          <div className="p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <p className="text-cw-red font-heading text-xs tracking-[0.4em] uppercase mb-4">
                Custom Packages
              </p>
              <h2 className="font-heading text-4xl md:text-5xl text-white leading-none">
                Don&apos;t see what<br />
                <span className="text-cw-red">you need?</span>
              </h2>
            </div>
            <div className="md:text-right max-w-xs">
              <p className="font-body text-white/40 text-sm leading-relaxed mb-6">
                We&apos;ll build a package tailored to your project, budget, and timeline.
                Just reach out and we&apos;ll make it work.
              </p>
              <Link
                href="/booking"
                className="inline-block bg-cw-red hover:bg-white hover:text-black text-white font-heading text-sm px-12 py-4 tracking-widest uppercase transition-colors"
              >
                Book a Session
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
