'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

interface MemberData {
  name: string
  email: string
  session_count: number
  monthly_beat_url: string
  created_at: string
}

function MemberPortal() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [member, setMember] = useState<MemberData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) { setError('No member token found.'); setLoading(false); return }
    fetch(`/api/member?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setMember(data)
      })
      .catch(() => setError('Unable to load member data.'))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/40 font-body text-sm tracking-widest">Loading...</p>
      </div>
    )
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-cw-red font-heading text-xs tracking-widest uppercase mb-4">Access Denied</p>
          <p className="text-white/50 font-body text-sm mb-8">This link is invalid or your membership is no longer active.</p>
          <Link href="/membership" className="bg-cw-red text-white font-heading text-xs px-8 py-4 tracking-widest uppercase hover:bg-white hover:text-black transition-colors">
            View Membership
          </Link>
        </div>
      </div>
    )
  }

  const sessionDiscount = member.session_count >= 1
  const joinDate = new Date(member.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/10 pt-40 md:pt-32 pb-10 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-cw-red font-heading text-xs tracking-[0.5em] uppercase mb-2">Soundlab Member</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white">Hey, {member.name.split(' ')[0]}.</h1>
          <p className="font-body text-white/30 text-sm mt-2">Member since {joinDate} · {member.session_count} session{member.session_count !== 1 ? 's' : ''} booked</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12 space-y-4">

        {/* Monthly beat */}
        <div className="border border-white/10 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-heading text-xs tracking-widest uppercase text-cw-red mb-1">This Month</p>
              <h2 className="font-heading text-xl text-white">WAV Lease Beat</h2>
              <p className="font-body text-white/40 text-sm mt-1">Your monthly beat is ready to download.</p>
            </div>
            {member.monthly_beat_url ? (
              <a
                href={member.monthly_beat_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 bg-cw-red text-white font-heading text-xs px-6 py-3 tracking-widest uppercase hover:bg-white hover:text-black transition-colors"
              >
                Download
              </a>
            ) : (
              <span className="flex-shrink-0 border border-white/10 text-white/20 font-heading text-xs px-6 py-3 tracking-widest uppercase">
                Coming Soon
              </span>
            )}
          </div>
        </div>

        {/* Session discount */}
        <div className="border border-white/10 p-6">
          <p className="font-heading text-xs tracking-widest uppercase text-cw-red mb-1">Session Perk</p>
          <h2 className="font-heading text-xl text-white mb-1">10% Off Sessions</h2>
          {sessionDiscount ? (
            <p className="font-body text-white/40 text-sm">Active. Your discount applies automatically at checkout when you use this email.</p>
          ) : (
            <p className="font-body text-white/40 text-sm">Unlocks after your first session. Book your first session and the discount kicks in on every booking after.</p>
          )}
          <Link
            href="/booking"
            className="inline-block mt-4 border border-white/10 hover:border-cw-red text-white/50 hover:text-white font-heading text-xs px-6 py-3 tracking-widest uppercase transition-colors"
          >
            Book a Session
          </Link>
        </div>

        {/* Partner discounts */}
        <div className="border border-white/10 p-6">
          <p className="font-heading text-xs tracking-widest uppercase text-cw-red mb-4">Partner Discounts</p>
          <div className="space-y-4">
            {[
              { name: 'Cleaning Services', detail: 'Show this page for 10% off professional cleaning' },
              { name: 'Logo & Graphic Design', detail: 'Show this page for 10% off logo and graphic design work' },
              { name: 'Album Artwork & Covers', detail: 'Show this page for 10% off custom artwork and covers' },
            ].map((p) => (
              <div key={p.name} className="flex items-start justify-between gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                <div>
                  <p className="font-heading text-sm text-white">{p.name}</p>
                  <p className="font-body text-white/30 text-xs mt-0.5">{p.detail}</p>
                </div>
                <span className="flex-shrink-0 bg-cw-red/10 text-cw-red font-heading text-xs px-3 py-1.5 tracking-wider">10% OFF</span>
              </div>
            ))}
          </div>
          <p className="font-body text-white/20 text-xs mt-4">Show this page to any partner to claim your discount.</p>
        </div>

      </div>
    </div>
  )
}

export default function MemberPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <MemberPortal />
    </Suspense>
  )
}
