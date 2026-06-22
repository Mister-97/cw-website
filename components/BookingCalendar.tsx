'use client'

import { useState } from 'react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

interface Props {
  value: string
  onChange: (date: string) => void
}

export default function BookingCalendar({ value, onChange }: Props) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  function toISO(day: number) {
    const m = String(viewMonth + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return `${viewYear}-${m}-${d}`
  }

  function isPast(day: number) {
    const d = new Date(viewYear, viewMonth, day)
    return d < today
  }

  const selectedISO = value

  return (
    <div className="border-2 border-black select-none">
      {/* Header */}
      <div className="flex items-center justify-between bg-black px-4 py-3">
        <button
          onClick={prevMonth}
          className="text-white hover:text-cw-red transition-colors text-lg font-heading px-2"
          aria-label="Previous month"
        >
          &#8592;
        </button>
        <span className="font-heading text-white text-sm tracking-widest uppercase">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="text-white hover:text-cw-red transition-colors text-lg font-heading px-2"
          aria-label="Next month"
        >
          &#8594;
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 border-b border-black/10">
        {DAYS.map(d => (
          <div key={d} className="text-center font-heading text-xs text-gray-400 py-2 tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />

          const iso = toISO(day)
          const past = isPast(day)
          const selected = iso === selectedISO

          return (
            <button
              key={iso}
              onClick={() => !past && onChange(iso)}
              disabled={past}
              className={`
                aspect-square flex items-center justify-center font-body text-sm transition-colors
                ${past ? 'text-gray-200 cursor-not-allowed' : ''}
                ${selected ? 'bg-cw-red text-white font-bold' : ''}
                ${!past && !selected ? 'hover:bg-red-50 hover:text-cw-red text-black' : ''}
              `}
            >
              {day}
            </button>
          )
        })}
      </div>

      {/* Selected date display */}
      {selectedISO && (
        <div className="border-t border-black/10 px-4 py-2 bg-gray-50">
          <p className="font-body text-xs text-gray-500 text-center">
            Selected: <span className="text-black font-semibold">
              {new Date(selectedISO + 'T12:00:00').toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
              })}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
