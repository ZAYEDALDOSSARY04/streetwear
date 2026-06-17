'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'

export default function AddToCartSection({ product }) {
  const [selectedSize, setSelectedSize] = useState('')
  const [added, setAdded] = useState(false)
  const addToCart = useCartStore(s => s.addToCart)
  const router = useRouter()

  function handleAdd() {
    if (!selectedSize) return
    addToCart(product, selectedSize)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Select Size</p>
          {!selectedSize && <p className="font-mono text-[10px] text-accent">Required</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {product.sizes?.map(size => (
            <button key={size.id} onClick={() => setSelectedSize(size.label)} disabled={size.stock === 0}
              className={`h-10 px-4 font-mono text-sm border transition-all ${
                selectedSize === size.label ? 'border-accent bg-accent text-bg font-bold'
                : size.stock === 0 ? 'border-border text-muted opacity-40 cursor-not-allowed line-through'
                : 'border-border hover:border-muted text-primary'
              }`}>
              {size.label}
            </button>
          ))}
        </div>
      </div>
      <button onClick={handleAdd} disabled={!selectedSize}
        className={`w-full h-12 font-display font-bold text-sm uppercase tracking-widest transition-all mb-3 ${
          added ? 'bg-accent/20 border border-accent text-accent'
          : selectedSize ? 'btn-accent' : 'bg-surface border border-border text-muted cursor-not-allowed'
        }`}>
        {added ? '✓ Added to Cart' : selectedSize ? 'Add to Cart' : 'Select a Size'}
      </button>
      <button onClick={() => router.push('/checkout')} disabled={!selectedSize}
        className="btn-ghost w-full h-12 text-sm disabled:opacity-40 disabled:cursor-not-allowed">
        Buy Now
      </button>
    </div>
  )
}
