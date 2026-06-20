'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // On hero (home page, not scrolled) transparent with white text
  // After scroll or on inner pages white bg with black text
  const isHero = pathname === '/' && !scrolled
  const textColor = isHero ? 'text-white' : 'text-black'
  const linkHover = isHero ? 'hover:text-cw-red' : 'hover:text-cw-red'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHero
          ? 'bg-transparent'
          : 'bg-white border-b border-black/10 shadow-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="CW Soundlab"
            width={120}
            height={60}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-heading text-sm tracking-widest uppercase transition-colors ${
                pathname === link.href
                  ? 'text-cw-red'
                  : `${textColor} ${linkHover}`
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/booking"
            className="bg-cw-red hover:bg-cw-red-dark text-white font-heading text-sm px-6 py-2.5 tracking-widest uppercase transition-colors"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 transition-all duration-300 ${isHero ? 'bg-white' : 'bg-black'} ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${isHero ? 'bg-white' : 'bg-black'} ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${isHero ? 'bg-white' : 'bg-black'} ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? 'max-h-72' : 'max-h-0'
        } bg-white border-b border-black/10`}
      >
        {[...links, { href: '/booking', label: 'Book Now' }].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center px-6 py-4 font-heading tracking-widest uppercase text-sm border-b border-black/5 transition-colors ${
              link.href === '/booking'
                ? 'text-cw-red'
                : pathname === link.href
                ? 'text-cw-red'
                : 'text-black hover:text-cw-red'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  )
}
