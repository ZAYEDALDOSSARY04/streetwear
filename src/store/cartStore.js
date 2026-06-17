'use client'
import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  items: [],
  isOpen: false,

  addToCart(product, size, qty = 1) {
    const key = `${product.id}__${size}`
    const existing = get().items.find(i => i.key === key)
    if (existing) {
      set({ items: get().items.map(i => i.key === key ? { ...i, quantity: i.quantity + qty } : i) })
    } else {
      set({ items: [...get().items, { key, product, size, quantity: qty }] })
    }
    set({ isOpen: true })
  },

  removeFromCart(key) {
    set({ items: get().items.filter(i => i.key !== key) })
  },

  updateQuantity(key, quantity) {
    if (quantity < 1) return
    set({ items: get().items.map(i => i.key === key ? { ...i, quantity } : i) })
  },

  clearCart() { set({ items: [] }) },

  get cartCount() { return get().items.reduce((s, i) => s + i.quantity, 0) },
  get cartSubtotal() { return get().items.reduce((s, i) => s + i.product.price * i.quantity, 0) },
}))
