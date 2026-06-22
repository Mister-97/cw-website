'use client'

import { useState } from 'react'
import type { Metadata } from 'next'

const perks = [
  {
    title: '10% Off Sessions',
    desc: 'Starting from your second booking, every session is automatically discounted. The more you record, the more you save.',
    icon: '🎙',
  },
  {
    title: '1 WAV Lease Beat / Month',
    desc: 'A fresh WAV-quality lease beat delivered to your inbox every month. Ready to record immediately.',
    icon: '🎵',
  },
  {
    title: '10% Off Cleaning Services',
    desc: 'Exclusive partner discount on professional cleaning services — keep your space as clean as your sound.',
    icon: '✨',
  },
  {
    title: '10% Off Logos, Design & Artwork',
    desc: 'Discounts on professional logo design, graphic design, and custom album artwork covers through our partner network.',
    icon: '🎨',
  },
]

export default function MembershipPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubscribe() {
    if (!name.trim() || !email.trim()) {
      setError('Please enter your name and email.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/membership/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <div className="pt-28 pb-20 px-4 text-center border-b border-white/10">
        <p className="text-cw-red font-heading tracking-[0.5em] uppercase text-xs mb-4">
          CW Soundlab · Chicago, IL
        </p>
        <h1 className="font-heading text-6xl md:text-8xl text-white leading-none mb-4">
          Soundlab<br />Member
        </h1>
        <p className="font-body text-white/50 text-base md:text-lg max-w-md mx-auto mt-6">
          One membership. Every perk. Built for artists who are serious about their craft.
        </p>
        <div className="mt-8 inline-flex items-baseline gap-2">
          <span className="font-heading text-6xl text-white">$9.99</span>
          <span className="font-body text-white/40 text-sm">/month</span>
        </div>
      </div>

      {/* Perks */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <p className="font-heading text-xs tracking-[0.5em] uppercase text-cw-red text-center mb-12">
          What You Get
        </p>
        <div className="grid md:grid-cols-2 gap-px bg-white/10">
          {perks.map((perk) => (
            <div key={perk.title} className="bg-black p-8">
              <div className="text-3xl mb-4">{perk.icon}</div>
              <h3 className="font-heading text-xl text-white mb-3">{perk.title}</h3>
              <p className="font-body text-white/40 text-sm leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subscribe form */}
      <div className="max-w-md mx-auto px-4 pb-28">
        <div className="border border-white/10 p-8">
          <p className="font-heading text-xs tracking-[0.5em] uppercase text-cw-red text-center mb-8">
            Join Now
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block font-heading text-xs text-white/50 tracking-widest uppercase mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 border border-white/10 focus:border-cw-red text-white font-body text-sm px-4 py-3.5 w-full outline-none transition-colors placeholder:text-white/20"
              />
            </div>
            <div>
              <label className="block font-heading text-xs text-white/50 tracking-widest uppercase mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border border-white/10 focus:border-cw-red text-white font-body text-sm px-4 py-3.5 w-full outline-none transition-colors placeholder:text-white/20"
              />
            </div>
          </div>

          {error && (
            <p className="text-cw-red font-body text-xs mb-4">{error}</p>
          )}

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className={`w-full font-heading text-sm py-4 tracking-widest uppercase transition-colors ${
              loading
                ? 'bg-white/10 text-white/30 cursor-not-allowed'
                : 'bg-cw-red hover:bg-white hover:text-black text-white'
            }`}
          >
            {loading ? 'Redirecting...' : 'Join for $9.99/month'}
          </button>

          <p className="text-center font-body text-xs text-white/20 mt-4">
            Cancel anytime. No contracts.
          </p>
        </div>
      </div>
    </div>
  )
}
