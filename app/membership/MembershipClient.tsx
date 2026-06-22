'use client'

import { useState } from 'react'
import Link from 'next/link'

const perks = [
  {
    label: '10% Off Sessions',
    detail: 'Starting from your second booking, every session is automatically discounted at checkout.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    label: '1 WAV Lease Beat / Month',
    detail: 'A professionally produced WAV-quality beat delivered to your inbox every month. Ready to record.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
  },
  {
    label: '10% Off Cleaning Services',
    detail: 'Exclusive partner discount on professional cleaning services for members.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    label: '10% Off Logos, Design & Artwork',
    detail: 'Discounts on logo design, graphic design and custom album artwork covers through our partner network.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
]

export default function MembershipClient() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubscribe() {
    if (!name.trim() || !email.trim()) { setError('Please enter your name and email.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/membership/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setError('Something went wrong. Please try again.')
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-cw-red font-heading tracking-[0.5em] uppercase text-xs mb-3">
              CW Soundlab · Chicago, IL
            </p>
            <h1 className="font-heading text-6xl md:text-7xl text-white leading-none">
              Soundlab<br />Member
            </h1>
          </div>
          <div className="text-left md:text-right">
            <div className="inline-flex items-baseline gap-2">
              <span className="font-heading text-6xl text-white">$9.99</span>
              <span className="font-body text-white/30 text-sm">/month</span>
            </div>
            <p className="font-body text-white/30 text-xs mt-1">Cancel anytime. No contracts.</p>
          </div>
        </div>
      </div>
      <div className="h-1.5 bg-cw-red" />

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">

          {/* Perks */}
          <div>
            <p className="font-heading text-xs tracking-widest uppercase text-gray-400 mb-8">What You Get</p>
            <div className="space-y-0">
              {perks.map((perk, i) => (
                <div key={perk.label} className={`flex gap-5 py-7 ${i < perks.length - 1 ? 'border-b border-black/10' : ''}`}>
                  <div className="w-10 h-10 border-2 border-black flex items-center justify-center flex-shrink-0 mt-0.5 text-black">
                    {perk.icon}
                  </div>
                  <div>
                    <p className="font-heading text-lg text-black leading-tight mb-1">{perk.label}</p>
                    <p className="font-body text-gray-400 text-sm leading-relaxed">{perk.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sign up form */}
          <div>
            <p className="font-heading text-xs tracking-widest uppercase text-gray-400 mb-8">Join Now</p>
            <div className="border-2 border-black p-8">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block font-heading text-xs text-black tracking-widest uppercase mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white border-2 border-black/20 focus:border-black text-black font-body text-sm px-4 py-3.5 w-full outline-none transition-colors placeholder:text-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-heading text-xs text-black tracking-widest uppercase mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white border-2 border-black/20 focus:border-black text-black font-body text-sm px-4 py-3.5 w-full outline-none transition-colors placeholder:text-gray-300"
                  />
                </div>
              </div>

              {error && <p className="text-cw-red font-body text-xs mb-4">{error}</p>}

              <button
                onClick={handleSubscribe}
                disabled={loading}
                className={`w-full font-heading text-sm py-4 tracking-widest uppercase transition-colors ${
                  loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-cw-red hover:bg-black text-white'
                }`}
              >
                {loading ? 'Redirecting...' : 'Join for $9.99/month'}
              </button>

              <p className="text-center font-body text-xs text-gray-300 mt-4">
                Secured by Stripe. To cancel, email{' '}
                <a href="mailto:cwsoundlab@gmail.com" className="text-black hover:text-cw-red transition-colors underline">
                  cwsoundlab@gmail.com
                </a>
              </p>
            </div>

            {/* Already a member */}
            <div className="mt-6 border-2 border-black/10 p-5 text-center">
              <p className="font-body text-sm text-gray-400 mb-2">Already a member?</p>
              <p className="font-body text-xs text-gray-300">Check your welcome email for your personal member link.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-black py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-body text-white/40 text-sm leading-relaxed">
            One membership. Every perk. Built for artists who record at CW Soundlab regularly and want more for their money.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/booking" className="border border-white/20 hover:border-white text-white/50 hover:text-white font-heading text-xs px-8 py-4 tracking-widest uppercase transition-colors">
              Book a Session
            </Link>
            <Link href="/services" className="border border-white/20 hover:border-white text-white/50 hover:text-white font-heading text-xs px-8 py-4 tracking-widest uppercase transition-colors">
              View Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
