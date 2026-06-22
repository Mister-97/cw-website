'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div className="bg-cw-red relative z-40">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0 animate-pulse" />
          <p className="font-body text-white text-xs truncate">
            <span className="font-heading tracking-wider">NEW</span>
            {' '}Soundlab Member is here — $9.99/mo gets you 10% off sessions, a monthly beat, and partner discounts.{' '}
            <Link href="/membership" className="underline underline-offset-2 hover:no-underline font-semibold">
              Join now
            </Link>
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-white/60 hover:text-white transition-colors text-lg leading-none flex-shrink-0"
          aria-label="Dismiss"
        >
          x
        </button>
      </div>
    </div>
  )
}
