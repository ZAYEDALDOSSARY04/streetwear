export const dynamic = 'force-dynamic'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import RevenueChart from '@/components/dashboard/RevenueChart'

async function getStats(shopId) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/dashboard/stats?shopId=${shopId}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const stats   = await getStats(session.user.shopId)
  const shop    = await prisma.shop.findUnique({ where: { id: session.user.shopId }, select: { status: true, name: true, city: true } })

  const cards = stats ? [
    { label: 'Net Earnings',    value: `${stats.currency ?? ''} ${Number(stats.netEarnings ?? 0).toFixed(0)}`,  sub: '90% of gross sales' },
    { label: 'Gross Revenue',   value: `${stats.currency ?? ''} ${Number(stats.grossRevenue ?? 0).toFixed(0)}`, sub: 'Before platform fee' },
    { label: 'Items Sold',      value: stats.itemsSold ?? 0,    sub: 'All time' },
    { label: 'Pending Orders',  value: stats.pendingOrders ?? 0, sub: 'Awaiting action' },
  ] : []

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="section-label mb-1">// overview</p>
          <h1 className="font-display font-black text-3xl">Dashboard</h1>
          <p className="text-muted text-sm mt-1">{shop?.name} · {shop?.city}</p>
        </div>
        {shop?.status !== 'APPROVED' && (
          <div className="bg-accent/5 border border-accent/30 px-4 py-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400">Shop {shop?.status}</span>
          </div>
        )}
      </div>

      {shop?.status !== 'APPROVED' && (
        <div className="bg-surface border border-accent/20 p-5 mb-8">
          <p className="font-display font-bold mb-1">Shop Under Review</p>
          <p className="text-muted text-sm">Your shop is being reviewed by our team. You can set up products now — they'll go live once approved.</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="bg-surface border border-border p-5">
            <p className="section-label mb-2">{c.label}</p>
            <p className="font-display font-black text-2xl text-accent">{c.value}</p>
            <p className="font-mono text-[10px] text-muted mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {stats?.monthlyData?.length > 0 && (
        <div className="bg-surface border border-border p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <p className="section-label">// revenue last 6 months</p>
            <p className="font-mono text-[10px] text-muted">net earnings</p>
          </div>
          <RevenueChart data={stats.monthlyData} />
        </div>
      )}

      {stats?.topProduct && (
        <div className="bg-surface border border-border p-5 mb-8">
          <p className="section-label mb-3">// best seller</p>
          <div className="flex items-center gap-4">
            <img src={stats.topProduct.photos?.[0] ?? `https://picsum.photos/seed/${stats.topProduct.id}/200/200`} alt="" className="w-16 h-20 object-cover bg-border" />
            <div>
              <p className="font-display font-bold">{stats.topProduct.name}</p>
              <p className="font-mono text-[10px] text-muted mt-1">{stats.topProduct.totalSold} units sold</p>
              <p className="text-accent font-mono text-sm mt-1">{stats.currency} {stats.topProduct.revenue?.toFixed(0)}</p>
            </div>
          </div>
        </div>
      )}

      {stats?.recentOrders?.length > 0 && (
        <div className="bg-surface border border-border">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <p className="section-label">// recent orders</p>
          </div>
          <div className="divide-y divide-border">
            {stats.recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 hover:bg-border/30 transition-colors">
                <div>
                  <p className="font-mono text-[11px] text-muted">{order.id.slice(-8).toUpperCase()}</p>
                  <p className="font-display font-semibold text-sm mt-0.5">{order.customer?.name ?? 'Guest'}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-accent">{order.totalAmount.toFixed(0)}</p>
                  <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 mt-1 inline-block ${
                    order.status === 'PAID' ? 'bg-green-500/10 text-green-400'
                    : order.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400'
                    : order.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-400'
                    : 'bg-border text-muted'}`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
