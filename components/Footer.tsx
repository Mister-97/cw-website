import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-black">
      {/* Red top accent */}
      <div className="h-1.5 bg-cw-red" />

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Image
              src="/logo.png"
              alt="CW Soundlab"
              width={140}
              height={70}
              className="object-contain mb-4"
            />
            <p className="font-heading text-xs text-white/30 tracking-widest uppercase mb-5">
              Chubbsdaproducer × Wizz Wizzet
            </p>
            <p className="font-body text-white/40 text-sm leading-relaxed">
              Chicago&apos;s premier recording studio. Professional sound.
              Real results. Built for artists who take their music seriously.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-heading text-xs text-white/30 tracking-widest uppercase mb-5 border-b border-white/10 pb-3">
              Navigate
            </p>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/services', label: 'Services & Pricing' },
                { href: '/gallery', label: 'Studio Gallery' },
                { href: '/booking', label: 'Book a Session' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-white/40 hover:text-cw-red text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-heading text-xs text-white/30 tracking-widest uppercase mb-5 border-b border-white/10 pb-3">
              Contact
            </p>
            <div className="space-y-3 font-body text-sm text-white/40">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cw-red rounded-full" /> Chicago, IL
              </p>
              <a
                href="https://go.flobooking.com/booking/cwsoundlab"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-cw-red transition-colors"
              >
                <span className="w-1.5 h-1.5 bg-cw-red rounded-full" /> FloBooking
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-white/20 text-xs">
            &copy; 2026 CW Soundlab. All rights reserved. Chicago, IL.
          </p>
          <Link
            href="/booking"
            className="bg-cw-red hover:bg-white hover:text-black text-white font-heading text-xs px-6 py-2.5 tracking-widest uppercase transition-colors"
          >
            Book a Session
          </Link>
        </div>
      </div>
    </footer>
  )
}
