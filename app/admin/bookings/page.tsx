import { supabase } from '@/lib/supabase'
import BookingsClient from './BookingsClient'

export const dynamic = 'force-dynamic'

export default async function AdminBookingsPage() {
  const [{ data: bookings }, { data: services }] = await Promise.all([
    supabase.from('bookings').select('*').order('date', { ascending: false }),
    supabase.from('services').select('id, name, price, duration').eq('active', true).order('sort_order'),
  ])
  return <BookingsClient initial={bookings ?? []} services={services ?? []} />
}
