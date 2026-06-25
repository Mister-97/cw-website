import { supabase } from '@/lib/supabase'
import GalleryClient from './GalleryClient'

export const dynamic = 'force-dynamic'

export default async function AdminGalleryPage() {
  const { data } = await supabase
    .from('gallery_photos')
    .select('*')
    .order('sort_order', { ascending: true })
  return <GalleryClient initial={data ?? []} />
}
