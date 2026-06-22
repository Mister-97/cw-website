import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

  const { data, error } = await supabase
    .from('members')
    .select('name, email, status, session_count, monthly_beat_url, created_at')
    .eq('token', token)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
  if (data.status !== 'active') return NextResponse.json({ error: 'Membership inactive' }, { status: 403 })

  return NextResponse.json(data)
}
