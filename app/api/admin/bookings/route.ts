import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('date', { ascending: false })
    .order('time', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { customer_name, service_name, date, time } = body
  if (!customer_name || !service_name || !date || !time) {
    return NextResponse.json({ error: 'customer_name, service_name, date, and time are required' }, { status: 400 })
  }
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      customer_name: body.customer_name,
      customer_email: body.customer_email ?? '',
      customer_phone: body.customer_phone ?? '',
      service_name: body.service_name,
      service_id: 'manual',
      date: body.date,
      time: body.time,
      duration: body.duration ?? null,
      price: body.price ?? 0,
      notes: body.notes ?? '',
      engineer: body.engineer ?? null,
      status: body.status ?? 'confirmed',
      payment_status: body.payment_status ?? 'unpaid',
    })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
