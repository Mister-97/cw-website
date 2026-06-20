import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Booking Confirmed | CW Soundlab',
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top red bar */}
      <div className="h-2 bg-cw-red" />

      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          {/* Check icon */}
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

          <div className="space-y-3">
            <Link
              href="/"
              className="block bg-cw-red hover:bg-black text-white font-heading text-xs px-10 py-4 tracking-widest uppercase transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/services"
              className="block border-2 border-black hover:border-cw-red hover:text-cw-red text-black font-heading text-xs px-10 py-4 tracking-widest uppercase transition-colors"
            >
              View More Services
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom black bar */}
      <div className="h-2 bg-black" />
    </div>
  )
}
