'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div className="bg-cw-red relative">
      <div className="max-w-6xl mx-auto px-10 py-2.5 flex items-center justify-center gap-3">
        <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0 animate-pulse" />
        <p className="font-body text-white text-xs text-center">
          <span className="font-heading tracking-wider">NEW</span>
          {' '}Soundlab Member is here: $9.99/mo gets you 10% off sessions, a monthly beat, and partner discounts.{' '}
          <Link href="/membership" className="underline underline-offset-2 hover:no-underline font-semibold">
            Join now
          </Link>
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors text-lg leading-none"
        aria-label="Dismiss"
      >
        x
      </button>
    </div>
  )
}
