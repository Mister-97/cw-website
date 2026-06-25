'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const links = [
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/gallery', label: 'Gallery' },
  { href: '/admin/bookings', label: 'Bookings' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  return (
    <div className="border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 mr-4">
            <span className="bg-cw-red px-2 py-0.5 font-heading text-xs tracking-widest uppercase">CW</span>
            <span className="font-heading text-base tracking-wider text-white hidden sm:block">Admin Portal</span>
          </div>
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-heading text-xs tracking-widest uppercase transition-colors ${
                pathname.startsWith(link.href)
                  ? 'text-cw-red'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading text-xs tracking-widest uppercase text-white/30 hover:text-white transition-colors hidden sm:block"
          >
            View Site
          </a>
          <button
            onClick={handleLogout}
            className="font-heading text-xs tracking-widest uppercase text-white/30 hover:text-cw-red transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
