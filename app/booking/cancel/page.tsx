'use client'

import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import Link from 'next/link'

function CancelContent() {
  const params = useSearchParams()
  const sessionId = params.get('session') ?? ''
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleCancel() {
    setStatus('loading')
    try {
      const res = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
      const data = await res.json()
      if (res.ok) setStatus('done')
      else { setErrorMsg(data.error ?? 'Something went wrong.'); setStatus('error') }
    } catch {
      setErrorMsg('Connection error. Please try again.')
      setStatus('error')
    }
  }

  if (!sessionId) {
    return (
      <div className="text-center">
        <p className="font-body text-gray-500 mb-6">Invalid cancellation link. Please contact cwsoundlab@gmail.com directly.</p>
        <Link href="/" className="bg-black text-white font-heading text-xs px-8 py-4 tracking-widest uppercase hover:bg-cw-red transition-colors">
          Back to Home
        </Link>
      </div>
    )
  }

  if (status === 'done') {
    return (
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cw-red flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7 text-cw-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-heading text-xs tracking-widest uppercase text-cw-red mb-3">Booking Cancelled</p>
        <h2 className="font-heading text-3xl text-black mb-4">Your booking has been cancelled.</h2>
        <p className="font-body text-gray-500 text-sm mb-8 max-w-sm mx-auto">
          A confirmation has been sent to your email. Want to find another time that works?
        </p>
        <Link href="/booking" className="bg-cw-red hover:bg-black text-white font-heading text-xs px-10 py-4 tracking-widest uppercase transition-colors">
          Rebook a Session
        </Link>
      </div>
    )
  }

  return (
    <div className="text-center">
      <p className="font-heading text-xs tracking-widest uppercase text-cw-red mb-3">Cancel Booking</p>
      <h2 className="font-heading text-3xl text-black mb-4">Are you sure?</h2>
      <p className="font-body text-gray-500 text-sm mb-2 max-w-sm mx-auto">
        This will cancel your session at CW Soundlab.
      </p>
      <p className="font-body text-xs text-gray-400 mb-8 max-w-sm mx-auto">
        Note: deposits are non-refundable if cancelled within 24 hours of your session.
      </p>

      {status === 'error' && (
        <p className="text-cw-red font-body text-sm mb-4">{errorMsg}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleCancel}
          disabled={status === 'loading'}
          className="bg-cw-red hover:bg-black text-white font-heading text-xs px-10 py-4 tracking-widest uppercase transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? 'Cancelling...' : 'Yes, Cancel My Booking'}
        </button>
        <Link href="/" className="border-2 border-black hover:border-cw-red hover:text-cw-red text-black font-heading text-xs px-10 py-4 tracking-widest uppercase transition-colors">
          Keep My Booking
        </Link>
      </div>
    </div>
  )
}

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="h-2 bg-cw-red" />
      <div className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="max-w-md w-full mx-auto">
          <Suspense fallback={<div className="text-center font-body text-gray-400">Loading...</div>}>
            <CancelContent />
          </Suspense>
        </div>
      </div>
      <div className="h-2 bg-black" />
    </div>
  )
}
