import { supabase } from '@/lib/supabase'
import ServicesClient from './ServicesClient'

export const dynamic = 'force-dynamic'

export default async function AdminServicesPage() {
  const { data } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true })

  return <ServicesClient initial={data ?? []} />
}
