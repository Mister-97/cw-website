'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Photo = {
  id: string
  src: string
  alt: string
  label: string
  span: string
  active: boolean
  sort_order: number
}

const EMPTY: Partial<Photo> = { src: '', alt: '', label: '', span: '', active: true }

const SPAN_OPTIONS = [
  { value: '', label: 'Normal (1x1)' },
  { value: 'md:col-span-2', label: 'Wide (2 columns)' },
  { value: 'md:row-span-2', label: 'Tall (2 rows)' },
  { value: 'md:col-span-2 md:row-span-2', label: 'Large (2x2)' },
]

export default function GalleryClient({ initial }: { initial: Photo[] }) {
  const router = useRouter()
  const [photos, setPhotos] = useState(initial)
  const [editing, setEditing] = useState<Partial<Photo> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)

  function openNew() { setEditing({ ...EMPTY }); setIsNew(true) }
  function openEdit(p: Photo) { setEditing({ ...p }); setIsNew(false) }
  function closeModal() { setEditing(null) }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    try {
      const res = isNew
        ? await fetch('/api/admin/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) })
        : await fetch(`/api/admin/gallery/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) })
      if (res.ok) { router.refresh(); setEditing(null) }
      else { const d = await res.json(); alert(d.error ?? 'Save failed') }
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this photo?')) return
    const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' })
    if (res.ok) setPhotos(prev => prev.filter(p => p.id !== id))
    else alert('Delete failed')
  }

  async function toggleActive(p: Photo) {
    const res = await fetch(`/api/admin/gallery/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !p.active }),
    })
    if (res.ok) setPhotos(prev => prev.map(x => x.id === p.id ? { ...x, active: !p.active } : x))
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl text-white">Gallery</h1>
            <p className="font-body text-white/40 text-sm mt-1">{photos.length} photos</p>
          </div>
          <button
            onClick={openNew}
            className="bg-cw-red hover:bg-red-700 text-white font-heading text-xs tracking-widest uppercase px-5 py-2.5 transition-colors"
          >
            + Add Photo
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map(p => (
            <div key={p.id} className={`relative border ${p.active ? 'border-white/10' : 'border-white/5 opacity-50'} group overflow-hidden`}>
              <div className="relative h-48 bg-white/5">
                <Image src={p.src} alt={p.alt || p.label} fill className="object-cover" sizes="33vw" unoptimized={p.src.startsWith('http')} />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-heading text-white text-sm truncate">{p.label || 'Untitled'}</p>
                    <p className="font-body text-white/30 text-xs truncate mt-0.5">{p.src}</p>
                  </div>
                  {!p.active && (
                    <span className="border border-white/20 text-white/40 font-heading text-[10px] px-1.5 py-0.5 tracking-widest uppercase flex-shrink-0">Hidden</span>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => toggleActive(p)} className="font-heading text-[10px] tracking-widest uppercase px-3 py-1.5 border border-white/20 text-white/40 hover:border-white/40 hover:text-white/60 transition-colors">
                    {p.active ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => openEdit(p)} className="font-heading text-[10px] tracking-widest uppercase px-3 py-1.5 border border-white/20 text-white/40 hover:border-cw-red hover:text-cw-red transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="font-heading text-[10px] tracking-widest uppercase px-3 py-1.5 border border-white/10 text-white/20 hover:border-red-500/50 hover:text-red-400 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {photos.length === 0 && (
          <p className="font-body text-white/20 text-sm text-center py-16">No photos yet. Add one above.</p>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 w-full max-w-md">
            <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h2 className="font-heading text-lg text-white tracking-wider">{isNew ? 'Add Photo' : 'Edit Photo'}</h2>
              <button onClick={closeModal} className="text-white/40 hover:text-white text-xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">
                  Image URL or Path
                </label>
                <input
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                  placeholder="https://... or /gallery/photo.png"
                  value={editing.src ?? ''}
                  onChange={e => setEditing(prev => ({ ...prev, src: e.target.value }))}
                />
                <p className="font-body text-white/20 text-xs mt-1">Paste any image URL, or a path to a file in /public/gallery/</p>
              </div>
              <div>
                <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Label</label>
                <input
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                  placeholder="e.g. Vocal Booth"
                  value={editing.label ?? ''}
                  onChange={e => setEditing(prev => ({ ...prev, label: e.target.value }))}
                />
              </div>
              <div>
                <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Alt Text</label>
                <input
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                  placeholder="Describe the photo for accessibility"
                  value={editing.alt ?? ''}
                  onChange={e => setEditing(prev => ({ ...prev, alt: e.target.value }))}
                />
              </div>
              <div>
                <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Grid Size</label>
                <select
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                  value={editing.span ?? ''}
                  onChange={e => setEditing(prev => ({ ...prev, span: e.target.value }))}
                >
                  {SPAN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editing.active ?? true} onChange={e => setEditing(prev => ({ ...prev, active: e.target.checked }))} className="accent-cw-red" />
                <span className="font-heading text-xs tracking-widest uppercase text-white/60">Visible on site</span>
              </label>
            </div>
            <div className="border-t border-white/10 px-6 py-4 flex justify-end gap-3">
              <button onClick={closeModal} className="font-heading text-xs tracking-widest uppercase px-4 py-2 border border-white/20 text-white/40 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="bg-cw-red hover:bg-red-700 text-white font-heading text-xs tracking-widest uppercase px-6 py-2 transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Photo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
