import Image from 'next/image'
import Link from 'next/link'
import { services } from '@/lib/services'
import MembershipPopup from '@/components/MembershipPopup'

const stats = [
  { value: '500+', label: 'Artists Recorded' },
  { value: '1000+', label: 'Songs Produced' },
  { value: '14', label: 'Services Offered' },
  { value: 'CHI', label: 'Chicago, IL' },
]

const features = [
  {
    title: 'Professional Sound',
    description:
      'Industry-standard equipment and acoustically treated rooms. Every session sounds polished from the first take.',
  },
  {
    title: 'Flexible Hours',
    description:
      'Early bird deals, late-night sessions, full studio days. We work around your schedule, not the other way around.',
  },
  {
    title: 'All Levels Welcome',
    description:
      'First verse or fifteenth album our engineers bring out the best in every artist who walks through the door.',
  },
]

const featuredIds = ['early-bird', 'recording-4hr', 'full-day', 'custom-production']
const featuredServices = featuredIds
  .map((id) => services.find((s) => s.id === id))
  .filter(Boolean) as typeof services

export default function HomePage() {
  return (
    <>
      <MembershipPopup />
      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Studio background photo */}
        <Image
          src="/studio-hero.png"
          alt="CW Soundlab studio"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark overlay strong enough for text legibility */}
        <div className="absolute inset-0 bg-black/65" />
        {/* Red tint at bottom for transition */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <Image
            src="/logo.png"
            alt="CW Soundlab"
            width={520}
            height={260}
            className="object-contain mx-auto drop-shadow-2xl mt-4 w-[85vw] sm:w-[520px]"
            priority
          />
          <p className="mt-3 text-white/80 font-body text-base sm:text-lg tracking-[0.3em] uppercase">
            Chicago&apos;s Premier Recording Studio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              href="/booking"
              className="bg-cw-red hover:bg-cw-red-dark text-white font-heading text-sm sm:text-base px-10 py-4 tracking-widest uppercase transition-colors duration-200"
            >
              Book a Session
            </Link>
            <Link
              href="/services"
              className="bg-white/10 hover:bg-white/20 border border-white/50 hover:border-white text-white font-heading text-sm sm:text-base px-10 py-4 tracking-widest uppercase transition-all duration-200 backdrop-blur-sm"
            >
              View Services
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ─── Stats Bar ────────────────────────────────────────────── */}
      <section className="bg-black border-b-4 border-cw-red">
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-4xl md:text-5xl text-cw-red">{s.value}</p>
              <p className="font-body text-xs text-white/50 mt-1 tracking-widest uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Featured Services ────────────────────────────────────── */}
      <section className="bg-white py-24 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
            <div>
              <p className="text-cw-red font-heading tracking-[0.45em] uppercase text-xs mb-3">
                Most Popular
              </p>
              <h2 className="font-heading text-5xl md:text-6xl text-black leading-none">
                Featured Sessions
              </h2>
            </div>
            <Link
              href="/services"
              className="self-start sm:self-end border-2 border-black/20 hover:border-cw-red hover:text-cw-red text-black/40 font-heading text-xs px-7 py-3 tracking-widest uppercase transition-all flex-shrink-0"
            >
              View All 14 →
            </Link>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            {/* ── Card 1: Early Bird narrow left ── */}
            {(() => {
              const s = featuredServices[0]
              return s ? (
                <div className="group relative border-2 border-black hover:border-cw-red bg-white overflow-hidden flex flex-col transition-all duration-300 shadow-sm hover:shadow-md">
                  {/* Watermark price */}
                  <span className="absolute -bottom-6 -right-3 font-heading text-[110px] leading-none text-black/[0.04] select-none pointer-events-none">
                    ${s.price}
                  </span>
                  <div className="h-1 bg-black group-hover:bg-cw-red transition-colors" />
                  <div className="p-8 flex-1 flex flex-col relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <span className="font-heading text-xs text-cw-red tracking-widest uppercase border border-cw-red/50 px-2.5 py-1">
                        {s.duration}
                      </span>
                      <span className="font-heading text-xs text-black/30 tracking-widest uppercase">
                        Best Value
                      </span>
                    </div>
                    <h3 className="font-heading text-2xl text-black leading-tight group-hover:text-cw-red transition-colors">
                      {s.name}
                    </h3>
                    <p className="font-body text-sm text-gray-500 mt-2 mb-auto leading-relaxed">{s.description}</p>
                    <div className="mt-10 pt-6 border-t-2 border-black/10">
                      <p className="font-heading text-6xl text-black mb-6">${s.price}</p>
                      <Link
                        href={`/booking?service=${s.id}`}
                        className="block w-full text-center bg-black hover:bg-cw-red text-white font-heading text-xs py-4 tracking-widest uppercase transition-colors duration-300"
                      >
                        Book Session
                      </Link>
                    </div>
                  </div>
                </div>
              ) : null
            })()}

            {/* ── Card 2: 4hr featured, center ── */}
            {(() => {
              const s = featuredServices[1]
              return s ? (
                <div className="group relative border-2 border-cw-red bg-white overflow-hidden flex flex-col transition-all duration-300 shadow-sm hover:shadow-md">
                  {/* Red corner badge */}
                  <div className="absolute top-0 right-0 bg-cw-red px-4 py-1.5">
                    <span className="font-heading text-xs text-white tracking-widest uppercase">Popular</span>
                  </div>
                  {/* Watermark price */}
                  <span className="absolute -bottom-6 -right-3 font-heading text-[110px] leading-none text-black/[0.04] select-none pointer-events-none">
                    ${s.price}
                  </span>
                  <div className="h-1 bg-cw-red" />
                  <div className="p-8 flex-1 flex flex-col relative z-10">
                    <span className="font-heading text-xs text-cw-red tracking-widest uppercase border border-cw-red/50 self-start px-2.5 py-1 mb-8">
                      {s.duration}
                    </span>
                    <h3 className="font-heading text-3xl text-black leading-tight mb-3 group-hover:text-cw-red transition-colors">
                      {s.name}
                    </h3>
                    <p className="font-body text-gray-400 text-xs leading-relaxed mb-auto line-clamp-2">
                      {s.description}
                    </p>
                    {s.includes && (
                      <ul className="mt-6 space-y-2">
                        {s.includes.map((item) => (
                          <li key={item} className="flex items-center gap-2.5 text-xs text-gray-400">
                            <span className="w-1 h-1 bg-cw-red rounded-full flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-8 pt-6 border-t-2 border-black/10">
                      <p className="font-heading text-6xl text-black mb-6 group-hover:text-cw-red transition-colors">${s.price}</p>
                      <Link
                        href={`/booking?service=${s.id}`}
                        className="block w-full text-center bg-cw-red hover:bg-black text-white font-heading text-xs py-4 tracking-widest uppercase transition-colors duration-300"
                      >
                        Book Session
                      </Link>
                    </div>
                  </div>
                </div>
              ) : null
            })()}

            {/* ── Cards 3 & 4: stacked right column ── */}
            <div className="flex flex-col gap-3">
              {featuredServices.slice(2).map((s) => (
                <div
                  key={s.id}
                  className="group relative border-2 border-black/20 hover:border-cw-red bg-white overflow-hidden flex flex-col transition-all duration-300 flex-1 shadow-sm hover:shadow-md"
                >
                  <div className="h-1 bg-black/10 group-hover:bg-cw-red transition-colors" />
                  <span className="absolute -bottom-4 -right-2 font-heading text-[80px] leading-none text-black/[0.04] select-none pointer-events-none">
                    ${s.price}
                  </span>
                  <div className="p-7 flex flex-col relative z-10 h-full">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div>
                        <h3 className="font-heading text-xl text-black leading-tight group-hover:text-cw-red transition-colors">
                          {s.name}
                        </h3>
                        <span className="font-heading text-xs text-cw-red tracking-widest uppercase mt-1 block">
                          {s.duration}
                        </span>
                      </div>
                      <p className="font-heading text-4xl text-black flex-shrink-0">${s.price}</p>
                    </div>
                    {s.includes && (
                      <ul className="space-y-1.5 mb-6">
                        {s.includes.slice(0, 2).map((item) => (
                          <li key={item} className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="w-1 h-1 bg-cw-red rounded-full flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link
                      href={`/booking?service=${s.id}`}
                      className="mt-auto block w-full text-center bg-black hover:bg-cw-red text-white font-heading text-xs py-3.5 tracking-widest uppercase transition-colors duration-300"
                    >
                      Book Session
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ─── Red divider band ─────────────────────────────────────── */}
      <div className="bg-cw-red py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-heading text-white text-xl md:text-2xl tracking-widest uppercase">
            Professional Sound. Real Results.
          </p>
          <Link
            href="/booking"
            className="bg-white text-cw-red hover:bg-black hover:text-white font-heading text-xs px-8 py-3 tracking-widest uppercase transition-colors flex-shrink-0"
          >
            Book Now
          </Link>
        </div>
      </div>

      {/* ─── Built for Artists × Trusted by the Best (Combined) ──── */}
      <section className="bg-black py-20 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Section headline */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-0">
            <div>
              <p className="text-cw-red font-heading text-xs tracking-[0.45em] uppercase mb-5">
                Why CW Soundlab
              </p>
              <h2 className="font-heading leading-none text-white">
                <span className="block text-5xl md:text-7xl">Built for Artists.</span>
                <span className="block text-5xl md:text-7xl text-cw-red">Trusted by the Best.</span>
              </h2>
            </div>
            <Link
              href="/booking"
              className="self-start lg:self-end bg-cw-red hover:bg-white hover:text-black text-white font-heading text-xs px-8 py-4 tracking-widest uppercase transition-colors flex-shrink-0"
            >
              Book a Session
            </Link>
          </div>

          {/* Features editorial numbered list */}
          <div className="mt-14">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="border-t border-white/10 py-7 grid grid-cols-[56px_1fr] md:grid-cols-[80px_1fr_1fr] gap-4 md:gap-10 group hover:bg-white/[0.03] transition-colors -mx-4 px-4"
              >
                {/* Number */}
                <span className="font-heading text-4xl md:text-5xl text-white/10 group-hover:text-cw-red transition-colors duration-300 leading-none mt-1">
                  0{i + 1}
                </span>
                {/* Title */}
                <div className="md:border-r md:border-white/10 md:pr-10">
                  <h3 className="font-heading text-2xl md:text-3xl text-white group-hover:text-cw-red transition-colors leading-tight">
                    {f.title}
                  </h3>
                </div>
                {/* Description hidden on mobile, shown md+ */}
                <p className="hidden md:block font-body text-white/40 text-sm leading-relaxed self-center group-hover:text-white/60 transition-colors">
                  {f.description}
                </p>
                {/* Mobile description */}
                <p className="md:hidden col-span-2 col-start-2 font-body text-white/40 text-xs leading-relaxed -mt-2">
                  {f.description}
                </p>
              </div>
            ))}
            <div className="border-t border-white/10" />
          </div>

          {/* Divider pill */}
          <div className="flex items-center gap-5 my-14">
            <div className="flex-1 h-px bg-white/10" />
            <div className="flex items-center gap-3 border border-cw-red/40 px-5 py-2">
              <div className="w-1.5 h-1.5 bg-cw-red rounded-full" />
              <p className="text-cw-red font-heading text-xs tracking-[0.4em] uppercase whitespace-nowrap">
                Produced &amp; Mixed For
              </p>
              <div className="w-1.5 h-1.5 bg-cw-red rounded-full" />
            </div>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Artist grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
            {[
              { src: '/artists/calboy.jpg', name: 'Calboy', project: 'Wildboy 2' },
              { src: '/artists/lil-keed.jpg', name: 'Lil Keed', project: "Keed Talk to 'Em 2" },
              { src: '/artists/tory-lanez.jpg', name: 'Tory Lanez', project: 'Album' },
              { src: '/artists/mr97.png', name: 'Mr. 97', project: 'Infatuation' },
              { src: '/artists/fat-money.png', name: 'Fat Money', project: 'El Gordo' },
              { src: '/artists/ashlee-bankz.jpg', name: 'Ashlee Bankz', project: 'Bliss' },
            ].map((artist) => (
              <div key={artist.name} className="group relative aspect-square overflow-hidden">
                <Image
                  src={artist.src}
                  alt={`${artist.name} ${artist.project}`}
                  fill
                  className="object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
                {/* Base overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                {/* Hover overlay darkens the top, dims less at bottom */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500" />
                {/* Red border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-cw-red transition-colors duration-400" />
                {/* Name always partially visible, more on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-heading text-white text-base leading-tight drop-shadow-lg">
                    {artist.name}
                  </p>
                  <p className="font-body text-cw-red text-xs mt-0.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                    {artist.project}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Credits marquee-style text */}
          <p className="text-center mt-8 text-white/20 font-heading text-xs tracking-[0.35em] uppercase">
            Calboy &nbsp;·&nbsp; Tory Lanez &nbsp;·&nbsp; Ashlee Bankz &nbsp;·&nbsp; Mr. 97
            &nbsp;·&nbsp; Lil Keed &nbsp;·&nbsp; Fat Money &nbsp;·&nbsp; &amp; more
          </p>

        </div>
      </section>

      {/* ─── Soundlab Member Section ──────────────────────────────── */}
      <section className="bg-zinc-900 border-t-4 border-cw-red py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 border border-cw-red/40 px-3 py-1 mb-6">
                <div className="w-1.5 h-1.5 bg-cw-red rounded-full animate-pulse" />
                <span className="font-heading text-xs text-cw-red tracking-widest uppercase">Now Available</span>
              </div>
              <h2 className="font-heading text-5xl md:text-6xl text-white leading-none mb-4">
                Soundlab<br />Member
              </h2>
              <p className="font-body text-white/40 text-sm leading-relaxed mb-6">
                One membership. Every perk. Built for artists serious about their craft.
              </p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="font-heading text-5xl text-white">$9.99</span>
                <span className="font-body text-white/30 text-sm">/month · Cancel anytime</span>
              </div>
              <Link
                href="/membership"
                className="inline-block bg-cw-red hover:bg-white hover:text-black text-white font-heading text-xs px-10 py-4 tracking-widest uppercase transition-colors"
              >
                Join the Lab
              </Link>
            </div>

            {/* Right — perks */}
            <div className="space-y-0 border border-white/10">
              {[
                { title: '10% Off Sessions', sub: 'From your 2nd booking onwards' },
                { title: '1 WAV Lease Beat / Month', sub: 'Fresh beat delivered to your inbox' },
                { title: '10% Off Cleaning Services', sub: 'Partner discount' },
                { title: '10% Off Design & Artwork', sub: 'Logos, graphics, album covers' },
              ].map((perk, i) => (
                <div key={perk.title} className={`flex items-center gap-4 px-6 py-5 ${i < 3 ? 'border-b border-white/10' : ''}`}>
                  <div className="w-1.5 h-1.5 bg-cw-red rounded-full flex-shrink-0" />
                  <div>
                    <p className="font-heading text-sm text-white">{perk.title}</p>
                    <p className="font-body text-white/30 text-xs mt-0.5">{perk.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pricing teaser ───────────────────────────────────────── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-3">
            <div>
              <p className="text-cw-red font-heading tracking-[0.45em] uppercase text-xs mb-2">
                Transparent Pricing
              </p>
              <h2 className="font-heading text-4xl md:text-5xl text-black leading-none">
                Sessions From <span className="text-cw-red">$65</span>
              </h2>
            </div>
            <Link
              href="/services"
              className="self-start sm:self-end bg-black hover:bg-cw-red text-white font-heading text-xs px-8 py-3.5 tracking-widest uppercase transition-colors flex-shrink-0"
            >
              All 14 Services →
            </Link>
          </div>

          {/* Price rows */}
          <div className="mt-10 border-t-2 border-black">
            {[
              { name: 'Quick Song', sub: 'Perfect for singles & freestyles', price: '$65', duration: '1 Hr', href: '/booking?service=quick-song' },
              { name: 'Early Bird', sub: 'Best value mornings before 1PM', price: '$80', duration: '2 Hrs', href: '/booking?service=early-bird' },
              { name: 'Mix & Master', sub: 'Radio-ready sound on your tracks', price: '$175', duration: 'Per Song', href: '/booking?service=mix-master' },
              { name: 'Full Day', sub: 'Max time, max output, max value', price: '$400', duration: '8 Hrs', href: '/booking?service=full-day' },
            ].map((item, i) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center justify-between border-b-2 border-black/10 hover:border-cw-red py-5 md:py-6 gap-4 transition-all duration-200 hover:bg-red-50 -mx-4 px-4"
              >
                {/* Index */}
                <span className="font-heading text-lg text-black/15 group-hover:text-cw-red transition-colors w-8 flex-shrink-0 hidden sm:block">
                  0{i + 1}
                </span>
                {/* Name + sub */}
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-xl md:text-2xl text-black group-hover:text-cw-red transition-colors leading-tight">
                    {item.name}
                  </p>
                  <p className="font-body text-xs text-gray-400 mt-0.5 truncate">{item.sub}</p>
                </div>
                {/* Duration badge */}
                <span className="hidden md:block font-heading text-xs text-cw-red border border-cw-red/40 px-3 py-1.5 tracking-widest uppercase flex-shrink-0">
                  {item.duration}
                </span>
                {/* Price */}
                <p className="font-heading text-3xl md:text-4xl text-black group-hover:text-cw-red transition-colors flex-shrink-0">
                  {item.price}
                </p>
                {/* Arrow */}
                <span className="font-heading text-black/20 group-hover:text-cw-red transition-all duration-200 group-hover:translate-x-1 flex-shrink-0 text-lg">
                  →
                </span>
              </Link>
            ))}
          </div>

          {/* Footer note */}
          <p className="text-center mt-6 font-body text-xs text-gray-300 tracking-widest uppercase">
            All sessions include engineer &nbsp;·&nbsp; No hidden fees &nbsp;·&nbsp; Book online in 2 min
          </p>

        </div>
      </section>

      {/* ─── CTA Banner ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-black py-24 px-4">
        <div className="absolute inset-0">
          <Image src="/gallery/lounge.png" alt="" fill className="object-cover object-center" sizes="100vw" />
          <div className="absolute inset-0 bg-black/75" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-cw-red font-heading text-xs tracking-[0.5em] uppercase mb-4">
            Chicago&apos;s Premier Studio
          </p>
          <h2 className="font-heading text-5xl md:text-7xl text-white mb-6 leading-none">
            Ready to Record?
          </h2>
          <p className="font-body text-white/60 text-base md:text-lg mb-10 max-w-xl mx-auto">
            Book your session online in minutes. Professional studio, real engineers, results you&apos;ll
            be proud to share.
          </p>
          <Link
            href="/booking"
            className="inline-block bg-cw-red hover:bg-white hover:text-black text-white font-heading text-base px-14 py-5 tracking-widest uppercase transition-colors duration-200"
          >
            Book Now
          </Link>
        </div>
      </section>
    </>
  )
}
