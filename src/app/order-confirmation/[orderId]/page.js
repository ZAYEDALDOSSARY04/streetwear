export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function OrderConfirmationPage({ params }) {
  const session = await getServerSession(authOptions)
  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: { items: { include: { product: true } }, customer: true },
  })

  if (!order) notFound()
  if (session && order.customerId !== session.user.id && session.user.role !== 'ADMIN') notFound()

  const addr = order.shippingAddress
  const deliveryDate = new Date(order.createdAt)
  deliveryDate.setDate(deliveryDate.getDate() + 7)
  const deliveryStr = deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <main className="max-w-3xl mx-auto px-6 sm:px-8 py-16">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-accent/10 border-2 border-accent flex items-center justify-center mx-auto mb-6">
          <span className="text-accent text-4xl">✓</span>
        </div>
        <p className="section-label mb-2">// order placed</p>
        <h1 className="font-display font-black text-3xl sm:text-4xl mb-2">YOUR ORDER IS CONFIRMED</h1>
        <p className="text-muted">Confirmation sent to <span className="text-primary">{typeof addr === 'object' ? (order.customer?.email ?? '') : ''}</span></p>
      </div>

      <div className="bg-surface border border-accent/40 p-5 mb-6 flex items-center justify-between">
        <div>
          <p className="section-label">Order Number</p>
          <p className="font-display font-black text-xl text-accent mt-1">{order.id.slice(-8).toUpperCase()}</p>
        </div>
        <div className="text-right">
          <p className="section-label">Estimated Delivery</p>
          <p className="font-display font-semibold text-sm mt-1">{deliveryStr}</p>
        </div>
      </div>

      <div className="bg-surface border border-border p-5 mb-6">
        <p className="section-label mb-4">// items ordered</p>
        <div className="space-y-4">
          {order.items.map(item => (
            <div key={item.id} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
              <img src={item.product.photos?.[0] ?? `https://picsum.photos/seed/${item.product.id}/200/200`} alt="" className="w-14 h-16 object-cover bg-border flex-shrink-0" />
              <div className="flex-1">
                <p className="font-display font-semibold text-sm">{item.product.name}</p>
                <p className="font-mono text-[10px] text-muted mt-0.5">Size: {item.size} · Qty: {item.quantity}</p>
              </div>
              <p className="font-mono font-bold text-accent text-sm">{item.product.currency} {(item.price * item.quantity).toFixed(0)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-border mt-4 pt-4 flex justify-between">
          <span className="font-display font-bold">Total</span>
          <span className="font-display font-black text-accent text-lg">{order.items[0]?.product?.currency} {order.totalAmount.toFixed(0)}</span>
        </div>
      </div>

      {addr && typeof addr === 'object' && (
        <div className="bg-surface border border-border p-5 mb-8">
          <p className="section-label mb-3">// shipping address</p>
          <p className="text-sm">{addr.name}</p>
          <p className="text-sm text-muted">{addr.address}</p>
          <p className="text-sm text-muted">{addr.city}, {addr.country}</p>
          <p className="text-sm text-muted">{addr.phone}</p>
        </div>
      )}

      <div className="bg-accent/5 border border-accent/20 p-4 mb-8">
        <p className="font-mono text-[10px] text-accent uppercase tracking-wider mb-1">StreetMap Promise</p>
        <p className="text-muted text-sm">10% of your purchase supports the local shop owner. Thank you. 🙏</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="btn-accent flex-1 text-center">Continue Shopping</Link>
        <Link href="/browse/bahrain" className="btn-ghost flex-1 text-center">Browse More Cities</Link>
      </div>
    </main>
  )
}
