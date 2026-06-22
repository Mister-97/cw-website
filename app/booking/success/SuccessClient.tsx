'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SuccessClient() {
  const params = useSearchParams()
  const joinMembership = params.get('join') === '1'
  const name = params.get('name') ?? ''
  const email = params.get('email') ?? ''

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="h-2 bg-cw-red" />

      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 border-4 border-cw-red flex items-center justify-center mx-auto mb-10">
            <svg className="w-9 h-9 text-cw-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <p className="text-cw-red font-heading tracking-[0.4em] uppercase text-xs mb-3">
            Booking Confirmed
          </p>
          <h1 className="font-heading text-5xl md:text-6xl text-black mb-6 leading-none">
            You&apos;re Booked!
          </h1>
          <p className="font-body text-gray-500 leading-relaxed mb-10 text-sm max-w-sm mx-auto">
            Your session at CW Soundlab is confirmed. Check your email for booking details.
            We can&apos;t wait to create with you.
          </p>

          {joinMembership ? (
            <div className="border-2 border-cw-red p-6 mb-6 text-left">
              <p className="font-heading text-xs tracking-widest uppercase text-cw-red mb-2">One More Step</p>
              <p className="font-heading text-xl text-black mb-2">Finish joining Soundlab Member</p>
              <p className="font-body text-gray-500 text-sm mb-5">
                Set up your $9.99/month membership to unlock 10% off future sessions, a monthly beat, and partner discounts.
              </p>
              <a
                href={`/api/membership/subscribe?prefill_name=${encodeURIComponent(name)}&prefill_email=${encodeURIComponent(email)}`}
                className="block w-full text-center bg-cw-red hover:bg-black text-white font-heading text-xs px-10 py-4 tracking-widest uppercase transition-colors"
                onClick={async (e) => {
                  e.preventDefault()
                  const res = await fetch('/api/membership/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email }),
                  })
                  const data = await res.json()
                  if (data.url) window.location.href = data.url
                }}
              >
                Complete Membership Setup
              </a>
            </div>
          ) : (
            <div className="border border-black/10 p-5 mb-6 text-left">
              <p className="font-heading text-xs tracking-widest uppercase text-gray-400 mb-2">Want to save on future sessions?</p>
              <p className="font-body text-sm text-gray-600 mb-3">Join Soundlab Member for $9.99/mo and get 10% off from your next booking.</p>
              <Link href="/membership" className="font-heading text-xs text-cw-red tracking-widest uppercase hover:underline">
                Learn More →
              </Link>
            </div>
          )}

          <div className="space-y-3">
            <Link href="/" className="block bg-black hover:bg-cw-red text-white font-heading text-xs px-10 py-4 tracking-widest uppercase transition-colors">
              Back to Home
            </Link>
            <Link href="/services" className="block border-2 border-black hover:border-cw-red hover:text-cw-red text-black font-heading text-xs px-10 py-4 tracking-widest uppercase transition-colors">
              View More Services
            </Link>
          </div>
        </div>
      </div>

      <div className="h-2 bg-black" />
    </div>
  )
}
