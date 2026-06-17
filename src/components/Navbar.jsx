'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useCartStore } from '@/store/cartStore'

export default function Navbar() {
  const { data: session } = useSession()
  const items    = useCartStore(s => s.items)
  const openCart = useCartStore(s => s.openCart)
  const cartCount = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <nav className="sticky top-0 z-40 bg-bg/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link href="/" className="font-display font-bold text-lg tracking-tight select-none">
          <span className="text-primary">STREET</span><span className="text-accent">MAP</span>
        </Link>

        <div className="hidden sm:flex items-center gap-6">
          <Link href="/" className="font-mono text-[11px] uppercase tracking-widest text-muted hover:text-primary transition-colors">Home</Link>
          <Link href="/browse/bahrain" className="font-mono text-[11px] uppercase tracking-widest text-muted hover:text-primary transition-colors">Browse</Link>
          {session?.user?.role === 'SHOP_OWNER' && (
            <Link href="/dashboard" className="font-mono text-[11px] uppercase tracking-widest text-muted hover:text-accent transition-colors">Dashboard</Link>
          )}
          {!session && (
            <Link href="/register/shop" className="font-mono text-[11px] uppercase tracking-widest text-muted hover:text-primary transition-colors">Sell</Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-muted hidden sm:block">{session.user.email?.split('@')[0]}</span>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="font-mono text-[10px] uppercase tracking-wider text-muted hover:text-red-400 transition-colors">Sign Out</button>
            </div>
          ) : (
            <Link href="/login" className="font-mono text-[11px] uppercase tracking-widest text-muted hover:text-primary transition-colors hidden sm:block">Login</Link>
          )}

          <button onClick={openCart} className="relative w-8 h-8 flex items-center justify-center border border-border hover:border-accent transition-colors" aria-label="Cart">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-bg text-[9px] font-mono font-bold w-4 h-4 flex items-center justify-center">{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}
