'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Service = {
  id: string
  name: string
  description: string
  duration: string
  duration_mins: number
  price: number
  price_note: string | null
  category: 'recording' | 'production' | 'post' | 'content'
  featured: boolean
  includes: string[]
  best_for: string | null
  active: boolean
  sort_order: number
}

const EMPTY: Partial<Service> = {
  name: '',
  description: '',
  duration: '',
  duration_mins: 60,
  price: 0,
  price_note: '',
  category: 'recording',
  featured: false,
  includes: [],
  best_for: '',
  active: true,
}

const CATEGORY_LABELS: Record<string, string> = {
  recording: 'Recording',
  production: 'Production',
  post: 'Mix & Master',
  content: 'Content',
}

export default function ServicesClient({ initial }: { initial: Service[] }) {
  const router = useRouter()
  const [services, setServices] = useState(initial)
  const [editing, setEditing] = useState<Partial<Service> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [includesText, setIncludesText] = useState('')

  function openNew() {
    setEditing({ ...EMPTY, includes: [] })
    setIncludesText('')
    setIsNew(true)
  }

  function openEdit(s: Service) {
    setEditing({ ...s })
    setIncludesText((s.includes ?? []).join('\n'))
    setIsNew(false)
  }

  function closeModal() {
    setEditing(null)
  }

  async function handleSave() {
    if (!editing) return
    setSaving(true)

    const payload = {
      ...editing,
      includes: includesText.split('\n').map(l => l.trim()).filter(Boolean),
      price_note: editing.price_note || null,
      best_for: editing.best_for || null,
    }

    try {
      let res: Response
      if (isNew) {
        res = await fetch('/api/admin/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch(`/api/admin/services/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      if (res.ok) {
        router.refresh()
        setEditing(null)
      } else {
        const d = await res.json()
        alert(d.error ?? 'Save failed')
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return

    const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setServices(prev => prev.filter(s => s.id !== id))
    } else {
      alert('Delete failed')
    }
  }

  async function toggleActive(s: Service) {
    const res = await fetch(`/api/admin/services/${s.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !s.active }),
    })
    if (res.ok) {
      setServices(prev => prev.map(x => x.id === s.id ? { ...x, active: !s.active } : x))
    }
  }

  const grouped = services.reduce<Record<string, Service[]>>((acc, s) => {
    acc[s.category] = acc[s.category] ?? []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <>
      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl text-white">Services</h1>
            <p className="font-body text-white/40 text-sm mt-1">{services.length} total services</p>
          </div>
          <button
            onClick={openNew}
            className="bg-cw-red hover:bg-red-700 text-white font-heading text-xs tracking-widest uppercase px-5 py-2.5 transition-colors"
          >
            + Add Service
          </button>
        </div>

        {/* Services by category */}
        {(['recording', 'production', 'post', 'content'] as const).map(cat => {
          const catServices = grouped[cat] ?? []
          return (
            <div key={cat} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-heading text-xs tracking-widest uppercase text-white/40 border border-white/20 px-2 py-1">
                  {CATEGORY_LABELS[cat]}
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {catServices.length === 0 ? (
                <p className="font-body text-white/20 text-sm pl-1">No services yet</p>
              ) : (
                <div className="space-y-2">
                  {catServices.map(s => (
                    <div
                      key={s.id}
                      className={`flex items-center gap-4 border px-5 py-4 transition-colors ${
                        s.active ? 'border-white/10 bg-white/[0.02]' : 'border-white/5 bg-white/[0.01] opacity-50'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-heading text-white text-base">{s.name}</span>
                          {s.featured && (
                            <span className="bg-cw-red text-white font-heading text-[10px] px-1.5 py-0.5 tracking-widest uppercase">
                              Popular
                            </span>
                          )}
                          {!s.active && (
                            <span className="border border-white/20 text-white/40 font-heading text-[10px] px-1.5 py-0.5 tracking-widest uppercase">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="font-body text-white/40 text-xs mt-0.5">
                          {s.duration} &middot; {s.price_note ?? (s.price === 0 ? 'Varies' : `$${s.price}`)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => toggleActive(s)}
                          className="font-heading text-[10px] tracking-widest uppercase px-3 py-1.5 border border-white/20 text-white/40 hover:border-white/40 hover:text-white/60 transition-colors"
                        >
                          {s.active ? 'Hide' : 'Show'}
                        </button>
                        <button
                          onClick={() => openEdit(s)}
                          className="font-heading text-[10px] tracking-widest uppercase px-3 py-1.5 border border-white/20 text-white/40 hover:border-cw-red hover:text-cw-red transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.name)}
                          className="font-heading text-[10px] tracking-widest uppercase px-3 py-1.5 border border-white/10 text-white/20 hover:border-red-500/50 hover:text-red-400 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-[#111] border border-white/10 w-full max-w-lg my-8">
            <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h2 className="font-heading text-lg text-white tracking-wider">
                {isNew ? 'New Service' : 'Edit Service'}
              </h2>
              <button onClick={closeModal} className="text-white/40 hover:text-white text-xl leading-none">&times;</button>
            </div>

            <div className="p-6 space-y-4">
              {isNew && (
                <div>
                  <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">ID (slug, no spaces)</label>
                  <input
                    className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                    placeholder="e.g. recording-3hr"
                    value={editing.id ?? ''}
                    onChange={e => setEditing(prev => ({ ...prev, id: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                  />
                </div>
              )}

              <div>
                <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Name</label>
                <input
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                  value={editing.name ?? ''}
                  onChange={e => setEditing(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red resize-none"
                  value={editing.description ?? ''}
                  onChange={e => setEditing(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Category</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                    value={editing.category ?? 'recording'}
                    onChange={e => setEditing(prev => ({ ...prev, category: e.target.value as Service['category'] }))}
                  >
                    <option value="recording">Recording</option>
                    <option value="production">Production</option>
                    <option value="post">Mix & Master</option>
                    <option value="content">Content</option>
                  </select>
                </div>

                <div>
                  <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Duration</label>
                  <input
                    className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                    placeholder="e.g. 2 hrs"
                    value={editing.duration ?? ''}
                    onChange={e => setEditing(prev => ({ ...prev, duration: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Price ($)</label>
                  <input
                    type="number"
                    className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                    value={editing.price ?? 0}
                    onChange={e => setEditing(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div>
                  <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Price Note (optional)</label>
                  <input
                    className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                    placeholder="e.g. From $150"
                    value={editing.price_note ?? ''}
                    onChange={e => setEditing(prev => ({ ...prev, price_note: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">
                  What&apos;s Included (one per line)
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red resize-none"
                  placeholder={"Professional recording\nVocal leveling\nSession file save"}
                  value={includesText}
                  onChange={e => setIncludesText(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Best For (optional)</label>
                <input
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                  placeholder="e.g. 1 song or quick vocal work"
                  value={editing.best_for ?? ''}
                  onChange={e => setEditing(prev => ({ ...prev, best_for: e.target.value }))}
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.featured ?? false}
                    onChange={e => setEditing(prev => ({ ...prev, featured: e.target.checked }))}
                    className="accent-cw-red"
                  />
                  <span className="font-heading text-xs tracking-widest uppercase text-white/60">Mark as Popular</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.active ?? true}
                    onChange={e => setEditing(prev => ({ ...prev, active: e.target.checked }))}
                    className="accent-cw-red"
                  />
                  <span className="font-heading text-xs tracking-widest uppercase text-white/60">Visible on site</span>
                </label>
              </div>
            </div>

            <div className="border-t border-white/10 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="font-heading text-xs tracking-widest uppercase px-4 py-2 border border-white/20 text-white/40 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-cw-red hover:bg-red-700 text-white font-heading text-xs tracking-widest uppercase px-6 py-2 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
