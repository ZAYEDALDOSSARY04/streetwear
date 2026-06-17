'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

const STATUS_FLOW = { PAID: 'CONFIRMED', CONFIRMED: 'SHIPPED', SHIPPED: 'DELIVERED' }
const STATUS_COLORS = {
  PENDING:   'bg-amber-500/10 text-amber-400',
  PAID:      'bg-green-500/10 text-green-400',
  CONFIRMED: 'bg-blue-500/10 text-blue-400',
  SHIPPED:   'bg-purple-500/10 text-purple-400',
  DELIVERED: 'bg-accent/10 text-accent',
  CANCELLED: 'bg-red-500/10 text-red-400',
}

export default function OrdersPage() {
  const { data: session } = useSession()
  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [updating, setUpdating] = useState(null)
  const [tracking, setTracking] = useState({})

  const fetchOrders = useCallback(async () => {
    const res = await fetch('/api/orders')
    if (res.ok) setOrders(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  async function advance(orderId, nextStatus) {
    setUpdating(orderId)
    const body = { status: nextStatus }
    if (nextStatus === 'SHIPPED' && tracking[orderId]) body.trackingNumber = tracking[orderId]
    const res = await fetch(`/api/orders/${orderId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) { const updated = await res.json(); setOrders(prev => prev.map(o => o.id === orderId ? updated : o)) }
    setUpdating(null)
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="mb-8">
        <p className="section-label mb-1">// manage orders</p>
        <h1 className="font-display font-black text-3xl">Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-surface border border-border p-16 text-center">
          <p className="text-5xl mb-4">📋</p>
          <p className="font-display font-bold text-xl mb-2">No orders yet</p>
          <p className="text-muted text-sm">Orders will appear here when customers purchase from your shop</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const addr       = order.shippingAddress
            const nextStatus = STATUS_FLOW[order.status]
            return (
              <div key={order.id} className="bg-surface border border-border p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-[10px] text-muted">#{order.id.slice(-8).toUpperCase()}</span>
                      <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-1 ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                      {order.trackingNumber && <span className="font-mono text-[9px] text-muted">Tracking: {order.trackingNumber}</span>}
                    </div>
                    <p className="font-display font-bold mt-1">{order.customer?.name ?? 'Guest'}</p>
                    {addr && typeof addr === 'object' && <p className="font-mono text-[10px] text-muted mt-0.5">{addr.city}, {addr.country}</p>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-display font-black text-xl text-accent">{order.totalAmount.toFixed(0)}</p>
                    <p className="font-mono text-[10px] text-muted">You earn: {order.shopEarnings?.toFixed(0)}</p>
                  </div>
                </div>

                {order.items?.length > 0 && (
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                    {order.items.map(item => (
                      <div key={item.id} className="flex-shrink-0 flex items-center gap-2 bg-border/30 px-3 py-2">
                        <img src={item.product?.photos?.[0] ?? `https://picsum.photos/seed/${item.product?.id}/100/100`} alt="" className="w-8 h-10 object-cover bg-border" />
                        <div>
                          <p className="font-mono text-[10px]">{item.product?.name}</p>
                          <p className="font-mono text-[9px] text-muted">Size {item.size} × {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {nextStatus && (
                  <div className="flex items-center gap-3 flex-wrap">
                    {nextStatus === 'SHIPPED' && (
                      <input placeholder="Tracking number (optional)" value={tracking[order.id] ?? ''}
                        onChange={e => setTracking(t => ({ ...t, [order.id]: e.target.value }))}
                        className="input-dark h-9 text-sm flex-1 min-w-[200px]" />
                    )}
                    <button onClick={() => advance(order.id, nextStatus)} disabled={updating === order.id}
                      className="btn-accent h-9 px-5 text-sm flex-shrink-0 disabled:opacity-60">
                      {updating === order.id ? '…' : `Mark as ${nextStatus}`}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
