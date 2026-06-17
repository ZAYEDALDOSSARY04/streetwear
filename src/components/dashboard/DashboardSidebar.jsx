'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, DollarSign, Settings } from 'lucide-react'

const NAV = [
  { href: '/dashboard',          label: 'Overview',   icon: LayoutDashboard },
  { href: '/dashboard/products', label: 'Products',   icon: Package },
  { href: '/dashboard/orders',   label: 'Orders',     icon: ShoppingBag },
  { href: '/dashboard/earnings', label: 'Earnings',   icon: DollarSign },
  { href: '/dashboard/settings', label: 'Settings',   icon: Settings },
]

export default function DashboardSidebar({ shopName }) {
  const path = usePathname()

  return (
    <aside className="w-56 flex-shrink-0 bg-surface border-r border-border flex flex-col min-h-[calc(100vh-56px)]">
      <div className="px-5 py-5 border-b border-border">
        <p className="section-label mb-1">Shop Dashboard</p>
        <p className="font-display font-bold text-sm truncate">{shopName ?? '…'}</p>
      </div>
      <nav className="flex-1 py-4">
        {NAV.map(item => {
          const active = path === item.href
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-5 py-3 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                active ? 'text-accent bg-accent/5 border-r-2 border-accent' : 'text-muted hover:text-primary'
              }`}
            >
              <Icon size={14} />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-5 py-4 border-t border-border">
        <Link href="/" className="font-mono text-[10px] text-muted hover:text-primary transition-colors uppercase tracking-wider">← Back to Store</Link>
      </div>
    </aside>
  )
}
