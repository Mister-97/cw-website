import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')
  if (!date) {
    return NextResponse.json({ slots: [] })
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('time')
    .eq('date', date)
    .eq('status', 'confirmed')

  if (error) {
    console.error('Slots fetch error:', error)
    return NextResponse.json({ slots: [] })
  }

  return NextResponse.json({ slots: data.map((b) => b.time) })
}
