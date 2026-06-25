import { supabase } from '@/lib/supabase'
import BookingsClient from './BookingsClient'

export const dynamic = 'force-dynamic'

export default async function AdminBookingsPage() {
  const { data } = await supabase
    .from('bookings')
    .select('*')
    .order('date', { ascending: false })
  return <BookingsClient initial={data ?? []} />
}
