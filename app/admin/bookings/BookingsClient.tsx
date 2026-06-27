'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Booking = {
  id: string
  service_name: string
  customer_name: string
  customer_email: string
  customer_phone: string
  date: string
  time: string
  price: number
  notes: string
  status: string
  engineer: string | null
  payment_status: string | null
  created_at: string
}

type NewBooking = {
  customer_name: string
  customer_email: string
  customer_phone: string
  service_name: string
  date: string
  time: string
  duration: string
  price: string
  engineer: string
  notes: string
  payment_status: string
  status: string
}

type Service = { id: string; name: string; price: number; duration: string }

const ENGINEERS = ['Wizz Wizzet', 'Chubbsdaproducer', 'King Mecca']

const EMPTY_NEW: NewBooking = {
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  service_name: '',
  date: '',
  time: '',
  duration: '',
  price: '',
  engineer: '',
  notes: '',
  payment_status: 'unpaid',
  status: 'confirmed',
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'text-green-400 border-green-400/30',
  cancelled: 'text-red-400 border-red-400/30',
  completed: 'text-white/40 border-white/20',
  rescheduled: 'text-yellow-400 border-yellow-400/30',
}

const PAYMENT_COLORS: Record<string, string> = {
  paid: 'text-green-400 border-green-400/30',
  unpaid: 'text-red-400 border-red-400/30',
  partial: 'text-yellow-400 border-yellow-400/30',
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

function pad(n: number) { return String(n).padStart(2, '0') }

function getCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)
  return days
}

export default function BookingsClient({ initial, services }: { initial: Booking[]; services: Service[] }) {
  const router = useRouter()
  const [bookings, setBookings] = useState(initial)
  const [editing, setEditing] = useState<Booking | null>(null)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState<'calendar' | 'list'>('calendar')

  const now = new Date()
  const nowCST = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }))
  const [calMonth, setCalMonth] = useState({ year: nowCST.getFullYear(), month: nowCST.getMonth() })
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const [creating, setCreating] = useState(false)
  const [newBooking, setNewBooking] = useState<NewBooking>(EMPTY_NEW)
  const [createError, setCreateError] = useState('')

  function openEdit(b: Booking) { setEditing({ ...b }) }
  function closeEdit() { setEditing(null) }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/bookings/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: editing.date,
          time: editing.time,
          status: editing.status,
          notes: editing.notes,
          engineer: editing.engineer,
          payment_status: editing.payment_status,
        }),
      })
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === editing.id ? { ...b, ...editing } : b))
        setEditing(null)
        router.refresh()
      } else {
        const d = await res.json()
        alert(d.error ?? 'Save failed')
      }
    } finally { setSaving(false) }
  }

  async function quickCancel(b: Booking) {
    if (!confirm(`Cancel booking for ${b.customer_name} on ${b.date}?`)) return
    const res = await fetch(`/api/admin/bookings/${b.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    })
    if (res.ok) setBookings(prev => prev.map(x => x.id === b.id ? { ...x, status: 'cancelled' } : x))
    else alert('Failed to cancel')
  }

  async function handleCreate() {
    setSaving(true)
    setCreateError('')
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newBooking, price: parseInt(newBooking.price) || 0 }),
      })
      const text = await res.text()
      let data: Record<string, unknown> = {}
      try { data = JSON.parse(text) } catch { /* not json */ }
      if (res.ok) {
        setBookings(prev => [data as unknown as Booking, ...prev])
        setCreating(false)
        setNewBooking(EMPTY_NEW)
        setCreateError('')
        router.refresh()
      } else {
        setCreateError((data.error as string) ?? `Error ${res.status}: failed to create booking`)
      }
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : 'Network error')
    } finally { setSaving(false) }
  }

  function prevMonth() {
    setCalMonth(prev => prev.month === 0
      ? { year: prev.year - 1, month: 11 }
      : { year: prev.year, month: prev.month - 1 })
    setSelectedDay(null)
  }
  function nextMonth() {
    setCalMonth(prev => prev.month === 11
      ? { year: prev.year + 1, month: 0 }
      : { year: prev.year, month: prev.month + 1 })
    setSelectedDay(null)
  }

  function dayStr(day: number) {
    return `${calMonth.year}-${pad(calMonth.month + 1)}-${pad(day)}`
  }

  const calDays = getCalendarDays(calMonth.year, calMonth.month)
  const todayStr = nowCST.toLocaleDateString('en-CA', { timeZone: 'America/Chicago' })

  const filtered = bookings
    .filter(b => filter === 'all' || b.status === filter)
    .filter(b => !selectedDay || b.date === selectedDay)

  const todayCST = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' }) // YYYY-MM-DD
  const upcoming = bookings.filter(b => b.status === 'confirmed' && b.date >= todayCST).length
  const unpaidCount = bookings.filter(b => (b.payment_status === 'unpaid' || !b.payment_status) && b.status !== 'cancelled').length

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl text-white">Bookings</h1>
            <p className="font-body text-white/40 text-sm mt-1">
              {bookings.length} total &middot; <span className="text-green-400">{upcoming} upcoming</span>
              {unpaidCount > 0 && <> &middot; <span className="text-red-400">{unpaidCount} unpaid</span></>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex border border-white/10">
              <button
                onClick={() => setView('calendar')}
                className={`font-heading text-[10px] tracking-widest uppercase px-3 py-1.5 transition-colors ${view === 'calendar' ? 'bg-cw-red text-white' : 'text-white/40 hover:text-white'}`}
              >
                Calendar
              </button>
              <button
                onClick={() => setView('list')}
                className={`font-heading text-[10px] tracking-widest uppercase px-3 py-1.5 transition-colors ${view === 'list' ? 'bg-cw-red text-white' : 'text-white/40 hover:text-white'}`}
              >
                List
              </button>
            </div>
            <button
              onClick={() => setCreating(true)}
              className="bg-cw-red hover:bg-red-700 text-white font-heading text-[10px] tracking-widest uppercase px-4 py-2 transition-colors"
            >
              + Add Booking
            </button>
          </div>
        </div>

        {/* Calendar */}
        {view === 'calendar' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="font-heading text-sm text-white/40 hover:text-white transition-colors w-8 h-8 flex items-center justify-center">&#8592;</button>
              <span className="font-heading text-base tracking-widest text-white uppercase">
                {MONTHS[calMonth.month]} {calMonth.year}
              </span>
              <button onClick={nextMonth} className="font-heading text-sm text-white/40 hover:text-white transition-colors w-8 h-8 flex items-center justify-center">&#8594;</button>
            </div>

            <div className="grid grid-cols-7 mb-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="font-heading text-[9px] tracking-widest uppercase text-white/20 text-center py-1">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5">
              {calDays.map((day, i) => {
                if (!day) return <div key={`e-${i}`} className="bg-[#0a0a0a] min-h-[88px]" />
                const ds = dayStr(day)
                const dayBookings = bookings.filter(b => b.date === ds)
                const isSelected = selectedDay === ds
                const isToday = ds === todayStr
                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(isSelected ? null : ds)}
                    className={`bg-[#0a0a0a] min-h-[88px] p-1.5 cursor-pointer transition-colors hover:bg-white/[0.025] ${isSelected ? 'ring-1 ring-inset ring-cw-red' : ''}`}
                  >
                    <span className={`font-heading text-[11px] block mb-1 ${isToday ? 'text-cw-red' : 'text-white/30'}`}>{day}</span>
                    <div className="space-y-0.5">
                      {dayBookings.slice(0, 3).map(b => (
                        <div
                          key={b.id}
                          onClick={e => { e.stopPropagation(); openEdit(b) }}
                          title={`${b.customer_name} — ${b.service_name} @ ${b.time}`}
                          className={`text-[9px] font-body px-1 py-px truncate cursor-pointer hover:opacity-80 leading-tight ${
                            b.status === 'cancelled'
                              ? 'bg-white/5 text-white/20'
                              : (b.payment_status === 'paid')
                              ? 'bg-green-900/40 text-green-300'
                              : (b.payment_status === 'partial')
                              ? 'bg-yellow-900/40 text-yellow-300'
                              : 'bg-red-900/40 text-red-300'
                          }`}
                        >
                          {b.customer_name} @ {b.time}
                        </div>
                      ))}
                      {dayBookings.length > 3 && (
                        <div className="text-[9px] font-body text-white/20 px-1">+{dayBookings.length - 3} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-5 mt-3">
              {[
                { cls: 'bg-green-900/40', label: 'Paid' },
                { cls: 'bg-red-900/40', label: 'Unpaid' },
                { cls: 'bg-yellow-900/40', label: 'Partial' },
                { cls: 'bg-white/5', label: 'Cancelled' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 ${l.cls}`} />
                  <span className="font-body text-[10px] text-white/30">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter bar */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex gap-2">
            {['all', 'confirmed', 'cancelled', 'completed'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`font-heading text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-colors ${filter === s ? 'bg-cw-red border-cw-red text-white' : 'border-white/20 text-white/40 hover:text-white'}`}
              >
                {s}
              </button>
            ))}
          </div>
          {selectedDay && (
            <div className="ml-auto flex items-center gap-2">
              <span className="font-body text-xs text-white/40">{selectedDay}</span>
              <button
                onClick={() => setSelectedDay(null)}
                className="font-heading text-[9px] tracking-widest uppercase text-white/30 hover:text-white border border-white/10 px-2 py-1 transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <p className="font-body text-white/20 text-sm text-center py-16">No bookings found.</p>
        ) : (
          <div className="space-y-2">
            {filtered.map(b => (
              <div
                key={b.id}
                className={`border px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors ${b.status === 'cancelled' ? 'border-white/5 opacity-50' : 'border-white/10 bg-white/[0.02]'}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="font-heading text-white text-base">{b.customer_name}</span>
                    <span className={`font-heading text-[10px] tracking-widest uppercase border px-1.5 py-0.5 ${STATUS_COLORS[b.status] ?? 'text-white/40 border-white/20'}`}>
                      {b.status}
                    </span>
                    <span className={`font-heading text-[10px] tracking-widest uppercase border px-1.5 py-0.5 ${PAYMENT_COLORS[b.payment_status ?? 'unpaid'] ?? 'text-white/40 border-white/20'}`}>
                      {b.payment_status ?? 'unpaid'}
                    </span>
                  </div>
                  <p className="font-body text-white/50 text-sm">
                    {b.service_name} &middot; {b.date} at {b.time} &middot; ${b.price}
                  </p>
                  <p className="font-body text-white/30 text-xs mt-0.5">
                    {b.customer_email}{b.customer_phone && <> &middot; {b.customer_phone}</>}
                    {b.engineer && <> &middot; Eng: {b.engineer}</>}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(b)}
                    className="font-heading text-[10px] tracking-widest uppercase px-3 py-1.5 border border-white/20 text-white/40 hover:border-cw-red hover:text-cw-red transition-colors"
                  >
                    Edit
                  </button>
                  {b.status !== 'cancelled' && (
                    <button
                      onClick={() => quickCancel(b)}
                      className="font-heading text-[10px] tracking-widest uppercase px-3 py-1.5 border border-white/10 text-white/20 hover:border-red-500/50 hover:text-red-400 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h2 className="font-heading text-lg text-white tracking-wider">Edit Booking</h2>
              <button onClick={closeEdit} className="text-white/40 hover:text-white text-xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-white/5 border border-white/10 px-4 py-3">
                <p className="font-heading text-white text-sm">{editing.customer_name}</p>
                <p className="font-body text-white/40 text-xs mt-0.5">{editing.service_name} &middot; ${editing.price}</p>
                <p className="font-body text-white/30 text-xs">{editing.customer_email} &middot; {editing.customer_phone}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Date</label>
                  <input type="date"
                    className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                    value={editing.date}
                    onChange={e => setEditing(prev => prev ? { ...prev, date: e.target.value } : prev)}
                  />
                </div>
                <div>
                  <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Time</label>
                  <input type="time"
                    className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                    value={editing.time}
                    onChange={e => setEditing(prev => prev ? { ...prev, time: e.target.value } : prev)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Status</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                    value={editing.status}
                    onChange={e => setEditing(prev => prev ? { ...prev, status: e.target.value } : prev)}
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="rescheduled">Rescheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Payment</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                    value={editing.payment_status ?? 'unpaid'}
                    onChange={e => setEditing(prev => prev ? { ...prev, payment_status: e.target.value } : prev)}
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Engineer</label>
                <select
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                  value={editing.engineer ?? ''}
                  onChange={e => setEditing(prev => prev ? { ...prev, engineer: e.target.value } : prev)}
                >
                  <option value="">-- Select engineer --</option>
                  {ENGINEERS.map(eng => <option key={eng} value={eng}>{eng}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Notes</label>
                <textarea rows={3}
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red resize-none"
                  value={editing.notes ?? ''}
                  onChange={e => setEditing(prev => prev ? { ...prev, notes: e.target.value } : prev)}
                />
              </div>
            </div>
            <div className="border-t border-white/10 px-6 py-4 flex justify-end gap-3">
              <button onClick={closeEdit} className="font-heading text-xs tracking-widest uppercase px-4 py-2 border border-white/20 text-white/40 hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="bg-cw-red hover:bg-red-700 text-white font-heading text-xs tracking-widest uppercase px-6 py-2 transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {creating && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h2 className="font-heading text-lg text-white tracking-wider">Add Booking</h2>
              <button onClick={() => { setCreating(false); setNewBooking(EMPTY_NEW) }} className="text-white/40 hover:text-white text-xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Client Name *</label>
                <input
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                  placeholder="Full name"
                  value={newBooking.customer_name}
                  onChange={e => setNewBooking(prev => ({ ...prev, customer_name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Email</label>
                  <input type="email"
                    className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                    placeholder="email@example.com"
                    value={newBooking.customer_email}
                    onChange={e => setNewBooking(prev => ({ ...prev, customer_email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Phone</label>
                  <input type="tel"
                    className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                    placeholder="(555) 000-0000"
                    value={newBooking.customer_phone}
                    onChange={e => setNewBooking(prev => ({ ...prev, customer_phone: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Service *</label>
                <select
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                  value={newBooking.service_name}
                  onChange={e => {
                    const svc = services.find(s => s.name === e.target.value)
                    setNewBooking(prev => ({
                      ...prev,
                      service_name: e.target.value,
                      price: svc ? String(svc.price) : prev.price,
                      duration: svc ? svc.duration : prev.duration,
                    }))
                  }}
                >
                  <option value="">-- Select service --</option>
                  {services.map(s => (
                    <option key={s.id} value={s.name}>{s.name} — ${s.price}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Date *</label>
                  <input type="date"
                    className="w-full bg-white/5 border border-white/10 text-white px-2 py-2 font-body text-xs focus:outline-none focus:border-cw-red"
                    value={newBooking.date}
                    onChange={e => setNewBooking(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Time *</label>
                  <input type="time"
                    className="w-full bg-white/5 border border-white/10 text-white px-2 py-2 font-body text-xs focus:outline-none focus:border-cw-red"
                    value={newBooking.time}
                    onChange={e => setNewBooking(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Duration</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                    value={newBooking.duration}
                    onChange={e => setNewBooking(prev => ({ ...prev, duration: e.target.value }))}
                  >
                    <option value="">-- Select --</option>
                    {['1 hr','1.5 hrs','2 hrs','3 hrs','4 hrs','5 hrs','6 hrs','7 hrs','8 hrs'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Price ($)</label>
                  <input type="number"
                    className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                    placeholder="100"
                    value={newBooking.price}
                    onChange={e => setNewBooking(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Status</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                    value={newBooking.status}
                    onChange={e => setNewBooking(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="rescheduled">Rescheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Payment</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                    value={newBooking.payment_status}
                    onChange={e => setNewBooking(prev => ({ ...prev, payment_status: e.target.value }))}
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Engineer</label>
                <select
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red"
                  value={newBooking.engineer}
                  onChange={e => setNewBooking(prev => ({ ...prev, engineer: e.target.value }))}
                >
                  <option value="">-- Select engineer --</option>
                  {ENGINEERS.map(eng => <option key={eng} value={eng}>{eng}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-heading text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Notes</label>
                <textarea rows={3}
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 font-body text-sm focus:outline-none focus:border-cw-red resize-none"
                  value={newBooking.notes}
                  onChange={e => setNewBooking(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
            <div className="border-t border-white/10 px-6 py-4 space-y-3">
              {createError && (
                <p className="font-body text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2">{createError}</p>
              )}
              {!createError && (() => {
                const missing = []
                if (!newBooking.customer_name) missing.push('Client Name')
                if (!newBooking.service_name) missing.push('Service')
                if (!newBooking.date) missing.push('Date')
                if (!newBooking.time) missing.push('Time')
                return missing.length > 0 ? (
                  <p className="font-body text-xs text-white/30">Required: {missing.join(', ')}</p>
                ) : null
              })()}
              <div className="flex justify-end gap-3">
              <button
                onClick={() => { setCreating(false); setNewBooking(EMPTY_NEW); setCreateError('') }}
                className="font-heading text-xs tracking-widest uppercase px-4 py-2 border border-white/20 text-white/40 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={saving || !newBooking.customer_name || !newBooking.service_name || !newBooking.date || !newBooking.time}
                className="bg-cw-red hover:bg-red-700 text-white font-heading text-xs tracking-widest uppercase px-6 py-2 transition-colors disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create Booking'}
              </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
