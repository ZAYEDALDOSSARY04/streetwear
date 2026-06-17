'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'

export default function CartPage() {
  const items     = useCartStore(s => s.items)
  const remove    = useCartStore(s => s.removeFromCart)
  const updateQty = useCartStore(s => s.updateQuantity)
  const clearCart = useCartStore(s => s.clearCart)
  const router    = useRouter()

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const shipping = items.length > 0 && subtotal <= 200 ? 10 : 0
  const total    = subtotal + shipping
  const currency = items[0]?.product.currency ?? ''

  return (
    <main className="max-w-7xl mx-auto px-6 sm:px-8 py-10 min-h-[80vh]">
      <div className="flex items-center justify-between mb-8">
        <div><p className="section-label mb-1">// review your order</p><h1 className="font-display font-black text-3xl">Your Cart</h1></div>
        {items.length > 0 && <button onClick={clearCart} className="font-mono text-[11px] uppercase tracking-wider text-muted hover:text-red-400 transition-colors">Clear All</button>}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24 border border-border">
          <p className="text-7xl mb-4">🛒</p>
          <h2 className="font-display font-bold text-2xl mb-2">Your cart is empty</h2>
          <p className="text-muted mb-8">Browse local streetwear shops to add items.</p>
          <Link href="/" className="btn-accent inline-block">Browse Shops</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.key} className="bg-surface border border-border flex gap-4 p-4">
                <Link href={`/product/${item.product.id}`}>
                  <img src={item.product.photos?.[0] ?? item.product.image} alt={item.product.name} className="w-24 h-28 object-cover bg-border flex-shrink-0" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-1">{item.product.styleTags?.[0]}</p>
                      <h3 className="font-display font-bold text-base">{item.product.name}</h3>
                      <p className="font-mono text-[11px] text-muted mt-1">Size: {item.size}</p>
                    </div>
                    <button onClick={() => remove(item.key)} className="text-muted hover:text-red-400 transition-colors text-xl leading-none flex-shrink-0">×</button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-0">
                      <button onClick={() => updateQty(item.key, item.quantity - 1)} className="w-8 h-8 border border-border hover:border-accent transition-colors font-mono text-sm">−</button>
                      <span className="w-10 h-8 border-y border-border flex items-center justify-center font-mono text-sm">{item.quantity}</span>
                      <button onClick={() => updateQty(item.key, item.quantity + 1)} className="w-8 h-8 border border-border hover:border-accent transition-colors font-mono text-sm">+</button>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-lg text-accent">{item.product.currency} {(item.product.price * item.quantity).toFixed(0)}</p>
                      <p className="font-mono text-[10px] text-muted">{item.product.currency} {item.product.price} each</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Link href="/" className="btn-ghost inline-block mt-2">← Continue Shopping</Link>
          </div>

          <div>
            <div className="bg-surface border border-border p-6 sticky top-20">
              <p className="section-label mb-5">// order summary</p>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm"><span className="text-muted">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span><span className="font-mono">{currency} {subtotal.toFixed(0)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted">Shipping</span><span className="font-mono">{shipping === 0 ? 'FREE' : `${currency} ${shipping}`}</span></div>
              </div>
              <div className="bg-accent/5 border border-accent/20 p-3 mb-5">
                <p className="font-mono text-[10px] text-accent uppercase tracking-wider mb-1">Platform Fee</p>
                <p className="font-mono text-[10px] text-muted">Included in prices. 10% per sale supports local shops.</p>
              </div>
              <div className="flex justify-between font-display font-bold text-lg border-t border-border pt-4 mb-5">
                <span>Total</span><span className="text-accent">{currency} {total.toFixed(0)}</span>
              </div>
              <button onClick={() => router.push('/checkout')} className="btn-accent w-full text-center">Proceed to Checkout →</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
