'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'

export default function CartSidebar() {
  const items      = useCartStore(s => s.items)
  const isOpen     = useCartStore(s => s.isOpen)
  const remove     = useCartStore(s => s.removeFromCart)
  const updateQty  = useCartStore(s => s.updateQuantity)
  const router     = useRouter()
  const subtotal   = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const shipping   = items.length > 0 && subtotal <= 200 ? 10 : 0
  const currency   = items[0]?.product.currency ?? ''

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50" onClick={() => useCartStore.setState({ isOpen: false })} />
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-surface border-l border-border z-50 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <p className="section-label">Your Cart</p>
            <p className="font-display font-bold text-lg">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          </div>
          <button onClick={() => useCartStore.setState({ isOpen: false })} className="w-8 h-8 flex items-center justify-center border border-border hover:border-accent text-muted hover:text-primary transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-5 space-y-4">
          {items.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🛒</p>
              <p className="font-display font-semibold">Cart is empty</p>
              <p className="text-muted text-sm mt-1">Browse local streetwear shops</p>
            </div>
          )}
          {items.map(item => (
            <div key={item.key} className="flex gap-3 pb-4 border-b border-border last:border-0">
              <img src={item.product.photos?.[0] ?? item.product.image} alt={item.product.name} className="w-16 h-20 object-cover bg-border flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-sm truncate">{item.product.name}</p>
                <p className="font-mono text-[10px] text-muted mt-0.5">Size: {item.size}</p>
                <p className="text-accent font-mono text-sm font-bold mt-1">{item.product.currency} {(item.product.price * item.quantity).toFixed(0)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQty(item.key, item.quantity - 1)} className="w-6 h-6 border border-border flex items-center justify-center text-xs hover:border-accent transition-colors">−</button>
                  <span className="font-mono text-sm w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item.key, item.quantity + 1)} className="w-6 h-6 border border-border flex items-center justify-center text-xs hover:border-accent transition-colors">+</button>
                  <button onClick={() => remove(item.key)} className="ml-auto text-muted hover:text-red-400 transition-colors text-xs font-mono uppercase">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border px-5 py-4 space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted">Subtotal</span><span className="font-mono">{currency} {subtotal.toFixed(0)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted">Shipping</span><span className="font-mono">{shipping === 0 ? 'FREE' : `${currency} ${shipping}`}</span></div>
            <div className="flex justify-between text-[11px] text-muted border-t border-border pt-2"><span>Platform fee</span><span>Included (10% to shops)</span></div>
            <div className="flex justify-between font-display font-bold text-base border-t border-border pt-2">
              <span>Total</span><span className="text-accent">{currency} {(subtotal + shipping).toFixed(0)}</span>
            </div>
            <button onClick={() => { useCartStore.setState({ isOpen: false }); router.push('/checkout') }} className="btn-accent w-full text-center">Checkout</button>
            <button onClick={() => { useCartStore.setState({ isOpen: false }); router.push('/cart') }} className="btn-ghost w-full text-center text-sm">View Full Cart</button>
          </div>
        )}
      </div>
    </>
  )
}
