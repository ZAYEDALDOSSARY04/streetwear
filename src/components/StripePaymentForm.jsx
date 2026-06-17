'use client'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '14px',
      color: '#F5F5F5',
      fontFamily: 'Inter, sans-serif',
      '::placeholder': { color: '#888888' },
      backgroundColor: 'transparent',
    },
    invalid: { color: '#ef4444' },
  },
}

function CheckoutForm({ clientSecret, onSuccess, onError }) {
  const stripe   = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    })

    setLoading(false)
    if (error) { onError(error.message); return }
    if (paymentIntent.status === 'succeeded') onSuccess(paymentIntent.id)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="font-mono text-[10px] uppercase tracking-wider text-muted block mb-2">Card Details</label>
        <div className="input-dark py-4">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <p className="font-mono text-[10px] text-muted mt-2">Test card: 4242 4242 4242 4242 · Any future date · Any CVC</p>
      </div>
      <button type="submit" disabled={!stripe || loading} className="btn-accent w-full h-12 disabled:opacity-40">
        {loading ? 'Processing…' : 'Pay & Place Order'}
      </button>
    </form>
  )
}

export default function StripePaymentForm({ clientSecret, onSuccess, onError }) {
  if (!clientSecret) return (
    <div className="bg-surface border border-border p-4 text-center">
      <p className="text-muted text-sm">Loading payment form…</p>
    </div>
  )

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
      <CheckoutForm clientSecret={clientSecret} onSuccess={onSuccess} onError={onError} />
    </Elements>
  )
}
