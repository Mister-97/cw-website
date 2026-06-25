import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { data: maxRow } = await supabase
    .from('gallery_photos')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()
  const sort_order = (maxRow?.sort_order ?? 0) + 1
  const { data, error } = await supabase
    .from('gallery_photos')
    .insert({ ...body, sort_order })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
