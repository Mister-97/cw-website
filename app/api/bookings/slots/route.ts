import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM',
  '11:00 PM', '12:00 AM', '1:00 AM', '2:00 AM',
]

function timeToMinutes(t: string): number {
  // "HH:MM" 24h
  if (/^\d{1,2}:\d{2}$/.test(t)) {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }
  // "H:MM AM/PM"
  const match = t.match(/^(\d+):(\d+)\s*(AM|PM)$/i)
  if (match) {
    let h = parseInt(match[1])
    const m = parseInt(match[2])
    const ampm = match[3].toUpperCase()
    if (ampm === 'PM' && h !== 12) h += 12
    if (ampm === 'AM' && h === 12) h = 0
    return h * 60 + m
  }
  return -1
}

function parseDurationMins(duration: string | null): number {
  if (!duration) return 60
  const match = duration.match(/^(\d+\.?\d*)\s*hr/)
  if (match) return Math.round(parseFloat(match[1]) * 60)
  return 60
}

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')
  if (!date) return NextResponse.json({ slots: [] })

  const { data, error } = await supabase
    .from('bookings')
    .select('time, duration, service_id, services(duration_mins)')
    .eq('date', date)
    .eq('status', 'confirmed')

  if (error) {
    console.error('Slots fetch error:', error)
    return NextResponse.json({ slots: [] })
  }

  const blocked = new Set<string>()

  for (const booking of data ?? []) {
    const startMins = timeToMinutes(booking.time)
    if (startMins < 0) continue

    // Get duration: prefer service duration_mins, fall back to booking duration text
    const svcMins = (booking.services as { duration_mins?: number } | null)?.duration_mins ?? null
    const durationMins = svcMins ?? parseDurationMins(booking.duration ?? null)

    // Block every TIME_SLOT that falls within [startMins, startMins + durationMins)
    for (const slot of TIME_SLOTS) {
      const slotMins = timeToMinutes(slot)
      if (slotMins >= startMins && slotMins < startMins + durationMins) {
        blocked.add(slot)
      }
    }
  }

  return NextResponse.json({ slots: Array.from(blocked) })
}
