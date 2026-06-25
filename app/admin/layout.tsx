import AdminNav from '@/components/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <AdminNav />
      {children}
    </div>
  )
}
