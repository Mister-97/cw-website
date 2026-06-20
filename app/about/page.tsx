import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About | CW Soundlab Chicago',
  description:
    'Meet Wizz Wizzet and Chubbsdaproducer, the Chicago producers behind CW Soundlab.',
}

const credits = [
  'Calboy', 'Tory Lanez', 'Lil Keed', 'Ashlee Bankz', 'Mr. 97', 'Fat Money',
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="bg-black pt-28 pb-0 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto pb-14">
          <p className="text-cw-red font-heading tracking-[0.4em] uppercase text-xs mb-6">
            CW Soundlab · Chicago, IL
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end">
            <h1 className="font-heading leading-none text-white">
              <span className="block text-7xl md:text-[100px] lg:text-[120px]">The</span>
              <span className="block text-7xl md:text-[100px] lg:text-[120px] text-cw-red">Team.</span>
            </h1>
            <p className="font-body text-white/40 text-sm leading-relaxed max-w-xs lg:pb-4">
              Two Chicago producers. One studio. Built from the ground up to give artists the professional
              environment they deserve.
            </p>
          </div>
        </div>
      </div>
      <div className="h-2 bg-cw-red" />

      {/* ── Person 1: Wizz Wizzet ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-2 border-black overflow-hidden">

          {/* Photo */}
          <div className="relative h-[500px] lg:h-auto min-h-[500px] bg-black">
            <Image
              src="/team/wizz-wizzet.png"
              alt="Wizz Wizzet at the studio console"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 lg:block hidden" />
            {/* Name tag */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-cw-red flex-shrink-0" />
                <div>
                  <p className="font-heading text-white text-2xl leading-none">Wizz Wizzet</p>
                  <p className="font-body text-cw-red text-xs mt-1 tracking-widest uppercase">
                    Co-Founder · Engineer & Producer
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white p-10 lg:p-14 flex flex-col justify-center">
            <span className="font-heading text-[80px] leading-none text-black/[0.04] select-none -mt-4 mb-2">
              01
            </span>
            <p className="text-cw-red font-heading tracking-[0.4em] uppercase text-xs mb-4">
              Co-Founder · Engineer &amp; Producer
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-black leading-none mb-6">
              Wizz Wizzet
            </h2>
            <div className="space-y-4 font-body text-gray-500 text-sm leading-relaxed">
              <p>
                Wizz Wizzet is one of Chicago&apos;s most in-demand studio engineers and the
                technical backbone behind CW Soundlab. With an ear for detail and a passion for
                pushing artists to their best takes, he&apos;s built a reputation for making
                sessions run smooth and sound even better.
              </p>
              <p>
                From punch-ins to full production sessions, Wizz brings the kind of professional
                energy that keeps artists coming back. Whether you&apos;re laying your first verse
                or putting the final touch on an album, he&apos;s locked in from the first
                take to the last bounce.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t-2 border-black/10 grid grid-cols-3 gap-4">
              {[
                { val: '500+', label: 'Sessions' },
                { val: '1k+', label: 'Songs' },
                { val: '7 yrs', label: 'Experience' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-2xl text-cw-red">{stat.val}</p>
                  <p className="font-body text-xs text-gray-400 uppercase tracking-widest mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Red divider ────────────────────────────────────────── */}
      <div className="bg-black py-8 px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-5">
          <div className="flex-1 h-px bg-white/10" />
          <div className="flex items-center gap-3 border border-cw-red/40 px-5 py-2">
            <div className="w-1.5 h-1.5 bg-cw-red rounded-full" />
            <p className="text-cw-red font-heading text-xs tracking-[0.4em] uppercase whitespace-nowrap">
              CW Soundlab
            </p>
            <div className="w-1.5 h-1.5 bg-cw-red rounded-full" />
          </div>
          <div className="flex-1 h-px bg-white/10" />
        </div>
      </div>

      {/* ── Person 2: Chubbsdaproducer ─────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-2 border-black overflow-hidden">

          {/* Bio flipped on desktop */}
          <div className="bg-black p-10 lg:p-14 flex flex-col justify-center order-2 lg:order-1">
            <span className="font-heading text-[80px] leading-none text-white/[0.04] select-none -mt-4 mb-2">
              02
            </span>
            <p className="text-cw-red font-heading tracking-[0.4em] uppercase text-xs mb-4">
              Co-Founder · Engineer &amp; Producer
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-white leading-none mb-6">
              Chubbsdaproducer
            </h2>
            <div className="space-y-4 font-body text-white/50 text-sm leading-relaxed">
              <p>
                Chubbsdaproducer is the creative engine behind CW Soundlab&apos;s production side.
                Known for his versatile sound and deep understanding of what makes a beat hit,
                he&apos;s crafted records for artists across Chicago and beyond.
              </p>
              <p>
                Whether it&apos;s trap, drill, R&amp;B, or something entirely his own, Chubbs builds
                from the soul. He approaches every session with the same hunger that put him on the
                map, making sure every artist leaves with something they&apos;re proud to play.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t-2 border-white/10 grid grid-cols-3 gap-4">
              {[
                { val: '200+', label: 'Beats Sold' },
                { val: '50+', label: 'Artists' },
                { val: 'CHI', label: 'Based' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-2xl text-cw-red">{stat.val}</p>
                  <p className="font-body text-xs text-white/30 uppercase tracking-widest mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Photo */}
          <div className="relative h-[500px] lg:h-auto min-h-[500px] bg-black order-1 lg:order-2">
            <Image
              src="/team/chubbsdaproducer.png"
              alt="Chubbsdaproducer"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20 lg:block hidden" />
            {/* Name tag */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-cw-red flex-shrink-0" />
                <div>
                  <p className="font-heading text-white text-2xl leading-none">Chubbsdaproducer</p>
                  <p className="font-body text-cw-red text-xs mt-1 tracking-widest uppercase">
                    Co-Founder · Engineer & Producer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Credits ────────────────────────────────────────────── */}
      <section className="bg-black py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-cw-red font-heading tracking-[0.4em] uppercase text-xs mb-3">
            Produced &amp; Mixed For
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-white mb-10 leading-none">
            Artist Credits
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {credits.map((name) => (
              <span
                key={name}
                className="font-heading text-sm text-white border border-white/15 hover:border-cw-red hover:text-cw-red px-5 py-2.5 tracking-widest uppercase transition-colors"
              >
                {name}
              </span>
            ))}
            <span className="font-heading text-sm text-white/30 border border-white/10 px-5 py-2.5 tracking-widest uppercase">
              &amp; more
            </span>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-4 border-t-2 border-black/10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-cw-red font-heading tracking-[0.4em] uppercase text-xs mb-4">
            Ready to Work?
          </p>
          <h2 className="font-heading text-5xl md:text-6xl text-black leading-none mb-6">
            Come to the Lab.
          </h2>
          <p className="font-body text-gray-400 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
            Book a session with Wizz Wizzet and Chubbsdaproducer. Chicago&apos;s studio is ready when you are.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/booking"
              className="inline-block bg-cw-red hover:bg-black text-white font-heading text-sm px-12 py-4 tracking-widest uppercase transition-colors"
            >
              Book a Session
            </Link>
            <Link
              href="/services"
              className="inline-block border-2 border-black hover:border-cw-red hover:text-cw-red text-black font-heading text-sm px-12 py-4 tracking-widest uppercase transition-colors"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
