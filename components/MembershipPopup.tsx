'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function MembershipPopup() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem('membership-popup-dismissed')) return
    const t = setTimeout(() => setShow(true), 10000)
    return () => clearTimeout(t)
  }, [])

  function dismiss() {
    sessionStorage.setItem('membership-popup-dismissed', '1')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={dismiss}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative bg-black border border-white/10 max-w-sm w-full p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-cw-red/40 px-3 py-1 mb-6">
          <div className="w-1.5 h-1.5 bg-cw-red rounded-full" />
          <span className="font-heading text-xs text-cw-red tracking-widest uppercase">Soundlab Member</span>
        </div>

        <h2 className="font-heading text-3xl text-white leading-tight mb-2">
          Join the Lab.<br />
          <span className="text-cw-red">$9.99/month.</span>
        </h2>

        <p className="font-body text-white/40 text-sm leading-relaxed mb-6">
          Get 10% off sessions, a free WAV lease beat every month, and exclusive partner discounts.
        </p>

        <ul className="space-y-2 mb-8">
          {[
            '10% off from your 2nd session',
            '1 WAV lease beat / month',
            '10% off cleaning services, design & artwork',
          ].map((perk) => (
            <li key={perk} className="flex items-center gap-2.5">
              <div className="w-1 h-1 bg-cw-red rounded-full flex-shrink-0" />
              <span className="font-body text-white/60 text-xs">{perk}</span>
            </li>
          ))}
        </ul>

        <Link
          href="/membership"
          onClick={dismiss}
          className="block w-full text-center bg-cw-red hover:bg-white hover:text-black text-white font-heading text-xs py-4 tracking-widest uppercase transition-colors"
        >
          Join Now
        </Link>

        <button
          onClick={dismiss}
          className="block w-full text-center font-body text-white/20 hover:text-white/50 text-xs mt-3 transition-colors"
        >
          No thanks
        </button>
      </div>
    </div>
  )
}
