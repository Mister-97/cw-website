'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        router.push('/admin/services')
      } else {
        const data = await res.json()
        setError(data.error ?? 'Invalid credentials')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="inline-block bg-cw-red px-3 py-1 font-heading text-xs tracking-[0.3em] uppercase mb-4">
            CW Soundlab
          </div>
          <h1 className="font-heading text-4xl text-white">Admin Portal</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-heading text-xs tracking-widest uppercase text-white/40 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 font-body text-sm focus:outline-none focus:border-cw-red transition-colors"
              placeholder="Email"
            />
          </div>

          <div>
            <label className="block font-heading text-xs tracking-widest uppercase text-white/40 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 font-body text-sm focus:outline-none focus:border-cw-red transition-colors"
              placeholder="Password"
            />
          </div>

          {error && (
            <p className="text-red-400 font-body text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cw-red hover:bg-red-700 text-white font-heading text-sm tracking-widest uppercase px-6 py-3.5 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
