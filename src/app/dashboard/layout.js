import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'

export const metadata = { title: 'Dashboard — Origin Wear' }

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')
  if (session.user.role === 'CUSTOMER') redirect('/')

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar session={session} />
      <div className="flex-1 min-w-0 lg:ml-64">
        <div className="p-6 sm:p-8 max-w-6xl">
          {children}
        </div>
      </div>
    </div>
  )
}
