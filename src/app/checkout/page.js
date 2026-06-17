'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/store/cartStore'

const PAY_METHODS = [
  { id: 'cod',      label: 'Cash on Delivery', icon: '💵', desc: 'Pay cash when your order arrives.' },
  { id: 'transfer', label: 'Bank Transfer',     icon: '🏦', desc: 'Transfer to our account and include your order number as reference.' },
]

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router    = useRouter()
  const items     = useCartStore(s => s.items)
  const clearCart = useCartStore(s => s.clearCart)

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const shipping = items.length > 0 && subtotal <= 200 ? 10 : 0
  const total    = subtotal + shipping
  const currency = items[0]?.product.currency ?? ''

  const [form, setForm]       = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', country: '', zip: '' })
  const [payMethod, setMethod] = useState('cod')
  const [placing, setPlacing] = useState(false)
  const [errors, setErrors]   = useState({})

  useEffect(() => {
    if (session?.user?.email) setForm(f => ({ ...f, email: session.user.email }))
  }, [session])

  function validate() {
    const e = {}
    if (!form.firstName) e.firstName = 'Required'
    if (!form.lastName)  e.lastName  = 'Required'
    if (!form.email || !form.email.includes('@')) e.email = 'Valid email required'
    if (!form.phone)    e.phone   = 'Required'
    if (!form.address)  e.address = 'Required'
    if (!form.city)     e.city    = 'Required'
    if (!form.country)  e.country = 'Required'
    return e
  }

  async function handleCheckout() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setPlacing(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.product.id, size: i.size, quantity: i.quantity })),
          shippingAddress: {
            name: `${form.firstName} ${form.lastName}`,
            address: form.address,
            city: form.city,
            country: form.country,
            phone: form.phone,
          },
          paymentMethod: payMethod,
        }),
      })
      if (!res.ok) throw new Error('Order failed')
      const order = await res.json()
      clearCart()
      router.push(`/order-confirmation/${order.id}`)
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  if (items.length === 0) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">🛒</p>
        <p className="font-display font-bold text-xl mb-4">No items to checkout</p>
        <Link href="/" className="btn-accent inline-block">Shop Now</Link>
      </div>
    </div>
  )

  return (
    <main className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
      <div className="mb-8">
        <p className="section-label mb-1">// secure checkout</p>
        <h1 className="font-display font-black text-3xl">Checkout</h1>
      </div>

      {!session && (
        <div className="bg-accent/5 border border-accent/20 p-4 mb-6 flex items-center justify-between">
          <p className="text-sm text-muted">Sign in to track your orders</p>
          <Link href="/login" className="btn-ghost text-sm py-2 px-4">Sign In</Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">

          {/* Shipping */}
          <section>
            <h2 className="font-display font-bold text-lg mb-5 pb-3 border-b border-border">Shipping Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['firstName', 'First Name',     true ],
                ['lastName',  'Last Name',      true ],
                ['email',     'Email',          false],
                ['phone',     'Phone',          false],
                ['address',   'Street Address', false],
                ['city',      'City',           true ],
                ['country',   'Country',        true ],
                ['zip',       'ZIP / Postal',   true ],
              ].map(([key, label, half]) => (
                <div key={key} className={half ? '' : 'sm:col-span-2'}>
                  <label className="section-label block mb-1.5">{label}</label>
                  <input
                    value={form[key]}
                    onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: '' })) }}
                    className={`input-dark ${errors[key] ? 'border-red-500' : ''}`}
                    placeholder={label}
                  />
                  {errors[key] && <p className="font-mono text-[10px] text-red-400 mt-1">{errors[key]}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="font-display font-bold text-lg mb-5 pb-3 border-b border-border">Payment Method</h2>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {PAY_METHODS.map(m => (
                <button key={m.id} onClick={() => setMethod(m.id)}
                  className={`flex items-center gap-3 p-4 border text-left transition-all ${payMethod === m.id ? 'border-accent bg-accent/5' : 'border-border hover:border-muted'}`}>
                  <span className="text-2xl">{m.icon}</span>
                  <div>
                    <p className="font-display font-semibold text-sm">{m.label}</p>
                    <p className="font-mono text-[10px] text-muted mt-0.5">{m.desc}</p>
                  </div>
                  {payMethod === m.id && <span className="ml-auto w-2.5 h-2.5 rounded-full bg-accent flex-shrink-0" />}
                </button>
              ))}
            </div>

            {payMethod === 'transfer' && (
              <div className="bg-surface border border-border p-4 mb-5">
                <p className="section-label mb-3">Bank Details</p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex gap-3"><span className="text-muted w-20">Bank</span><span>StreetMap Payments LLC</span></div>
                  <div className="flex gap-3"><span className="text-muted w-20">IBAN</span><span className="font-mono">BH01 SMAP 0000 0000 0000 00</span></div>
                  <div className="flex gap-3"><span className="text-muted w-20">Reference</span><span>Your order number (shown after placing)</span></div>
                </div>
              </div>
            )}

            <button onClick={handleCheckout} disabled={placing}
              className="btn-accent w-full h-12 text-sm disabled:opacity-60">
              {placing ? 'Placing Order…' : `Place Order · ${currency} ${total.toFixed(0)}`}
            </button>
          </section>

        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <div className="bg-surface border border-border p-6 sticky top-20">
            <p className="section-label mb-5">// order summary</p>
            <div className="space-y-3 mb-5 max-h-56 overflow-y-auto">
              {items.map(item => (
                <div key={item.key} className="flex gap-3">
                  <img src={item.product.photos?.[0] ?? item.product.image} alt=""
                    className="w-12 h-14 object-cover bg-border flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-sm truncate">{item.product.name}</p>
                    <p className="font-mono text-[10px] text-muted">Size: {item.size} · Qty: {item.quantity}</p>
                    <p className="font-mono text-sm text-accent mt-0.5">
                      {item.product.currency} {(item.product.price * item.quantity).toFixed(0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-border pt-4 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-mono">{currency} {subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Shipping</span>
                <span className="font-mono">{shipping === 0 ? 'FREE' : `${currency} ${shipping}`}</span>
              </div>
            </div>
            <div className="flex justify-between font-display font-black text-xl border-t border-border pt-4">
              <span>Total</span>
              <span className="text-accent">{currency} {total.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
