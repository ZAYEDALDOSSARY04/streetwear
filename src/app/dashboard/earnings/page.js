export const dynamic = 'force-dynamic'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function EarningsPage() {
  const session = await getServerSession(authOptions)

  const orders = await prisma.order.findMany({
    where: { shopId: session.user.shopId, status: { in: ['PAID', 'CONFIRMED', 'SHIPPED', 'DELIVERED'] } },
    include: { items: { include: { product: { select: { name: true, currency: true } } } } },
    orderBy: { createdAt: 'desc' },
  })

  const grossRevenue = orders.reduce((s, o) => s + Number(o.totalAmount), 0)
  const platformFee  = orders.reduce((s, o) => s + Number(o.platformFee), 0)
  const netEarnings  = orders.reduce((s, o) => s + Number(o.shopEarnings), 0)
  const currency     = orders[0]?.items[0]?.product?.currency ?? ''

  const byMonth = {}
  orders.forEach(o => {
    const key = new Date(o.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    if (!byMonth[key]) byMonth[key] = { gross: 0, net: 0, count: 0 }
    byMonth[key].gross  += Number(o.totalAmount)
    byMonth[key].net    += Number(o.shopEarnings)
    byMonth[key].count  += 1
  })

  return (
    <div>
      <div className="mb-8">
        <p className="section-label mb-1">// revenue breakdown</p>
        <h1 className="font-display font-black text-3xl">Earnings</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface border border-border p-6">
          <p className="section-label mb-3">Gross Revenue</p>
          <p className="font-display font-black text-3xl">{currency} {grossRevenue.toFixed(0)}</p>
          <p className="font-mono text-[10px] text-muted mt-1">Total sales value</p>
        </div>
        <div className="bg-border/30 border border-border p-6">
          <p className="section-label mb-3">Platform Fee (10%)</p>
          <p className="font-display font-black text-3xl text-red-400">−{currency} {platformFee.toFixed(0)}</p>
          <p className="font-mono text-[10px] text-muted mt-1">Origin Wear commission</p>
        </div>
        <div className="bg-accent/5 border border-accent/30 p-6">
          <p className="section-label mb-3">Your Net Earnings</p>
          <p className="font-display font-black text-3xl text-accent">{currency} {netEarnings.toFixed(0)}</p>
          <p className="font-mono text-[10px] text-muted mt-1">After platform fee</p>
        </div>
      </div>

      {Object.keys(byMonth).length > 0 && (
        <div className="bg-surface border border-border mb-8">
          <div className="px-5 py-4 border-b border-border">
            <p className="section-label">// monthly breakdown</p>
          </div>
          <div className="divide-y divide-border">
            {Object.entries(byMonth).map(([month, data]) => (
              <div key={month} className="grid grid-cols-4 gap-4 px-5 py-4 hover:bg-border/20 transition-colors">
                <p className="font-display font-semibold">{month}</p>
                <p className="font-mono text-sm text-muted">{data.count} orders</p>
                <p className="font-mono text-sm">{currency} {data.gross.toFixed(0)}</p>
                <p className="font-mono text-sm text-accent font-bold">{currency} {data.net.toFixed(0)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-surface border border-border">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <p className="section-label">// transaction history</p>
          <p className="font-mono text-[10px] text-muted">{orders.length} orders</p>
        </div>
        {orders.length === 0 ? (
          <div className="p-12 text-center"><p className="text-muted">No transactions yet</p></div>
        ) : (
          <div className="divide-y divide-border">
            {orders.map(order => (
              <div key={order.id} className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-5 py-4">
                <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                <div>
                  <p className="font-mono text-[10px] text-muted">#{order.id.slice(-8).toUpperCase()}</p>
                  <p className="font-mono text-[10px] text-muted mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="font-mono text-sm text-muted">{currency} {Number(order.totalAmount).toFixed(0)}</p>
                <p className="font-mono text-[10px] text-red-400">−{currency} {Number(order.platformFee).toFixed(0)}</p>
                <p className="font-mono text-sm text-accent font-bold">{currency} {Number(order.shopEarnings).toFixed(0)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
