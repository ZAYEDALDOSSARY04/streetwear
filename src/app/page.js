export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ShopCard from '@/components/ShopCard'
import GlobeSelector from '@/components/GlobeSelector'

const FEATURED_CITIES = [
  { id: 'bahrain',  name: 'Bahrain',  flag: '🇧🇭', desc: 'Gulf-born streetwear' },
  { id: 'riyadh',   name: 'Riyadh',   flag: '🇸🇦', desc: 'Saudi capital drip' },
  { id: 'dubai',    name: 'Dubai',    flag: '🇦🇪', desc: 'Coming soon' },
  { id: 'kuwait',   name: 'Kuwait',   flag: '🇰🇼', desc: 'Coming soon' },
  { id: 'cairo',    name: 'Cairo',    flag: '🇪🇬', desc: 'Coming soon' },
  { id: 'istanbul', name: 'Istanbul', flag: '🇹🇷', desc: 'Coming soon' },
]

export default async function HomePage() {
  const shops = await prisma.shop.findMany({
    where: { status: 'APPROVED' },
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: 'desc' },
    take: 4,
  })

  const totalShops = await prisma.shop.count({ where: { status: 'APPROVED' } })

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-4 pt-8">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <p className="font-display font-black text-[18vw] leading-none text-white/[0.02] whitespace-nowrap">ORIGIN</p>
        </div>

        <div className="relative z-10 text-center mb-6">
          <p className="section-label mb-3">// discover local streetwear</p>
          <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl leading-none tracking-tight mb-4">
            <span className="text-primary">ORIGIN</span>
            <span className="text-accent"> WEAR</span>
          </h1>
          <p className="text-muted text-sm sm:text-base max-w-md mx-auto font-body">
            Shop authentic streetwear from local brands across the globe. Every purchase supports a real shop owner in their city.
          </p>
          <div className="flex items-center gap-3 justify-center mt-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[11px] text-muted uppercase tracking-wider">{totalShops} shops live worldwide</span>
          </div>
        </div>

        <div className="relative z-10 w-full flex justify-center">
          <GlobeSelector />
        </div>

        <p className="relative z-10 font-mono text-[10px] text-muted mt-4 animate-bounce">
          drag to explore · click a city to shop
        </p>
      </section>

      {/* Featured shops */}
      {shops.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
          <div className="flex items-center gap-4 mb-10">
            <div>
              <p className="section-label mb-1">// featured shops</p>
              <h2 className="font-display font-black text-3xl">NOW DROPPING</h2>
            </div>
            <div className="h-px flex-1 bg-border" />
            <Link href="/browse/bahrain" className="font-mono text-[11px] uppercase tracking-wider text-muted hover:text-accent transition-colors">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {shops.map(shop => <ShopCard key={shop.id} shop={shop} />)}
          </div>
        </section>
      )}

      {/* City grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 pb-20">
        <div className="flex items-center gap-4 mb-8">
          <div>
            <p className="section-label mb-1">// browse by city</p>
            <h2 className="font-display font-black text-3xl">CITIES</h2>
          </div>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {FEATURED_CITIES.map(city => (
            <Link key={city.id} href={`/browse/${city.id}`}
              className="group bg-surface border border-border hover:border-accent transition-all p-4 flex flex-col items-center text-center">
              <span className="text-3xl mb-2">{city.flag}</span>
              <p className="font-display font-bold text-sm group-hover:text-accent transition-colors">{city.name}</p>
              <p className="font-mono text-[9px] text-muted mt-1">{city.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <p className="section-label mb-2">// for shop owners</p>
            <h2 className="font-display font-black text-3xl sm:text-4xl leading-tight">
              SELL ON<br /><span className="text-accent">ORIGIN WEAR</span>
            </h2>
            <p className="text-muted mt-3 max-w-sm">List your shop, upload products, and reach streetwear customers across the region. Keep 90% of every sale.</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/register/shop" className="btn-accent px-8 py-3 text-base text-center">Open Your Shop</Link>
            <p className="font-mono text-[10px] text-muted text-center">Free to list · 10% platform fee per sale</p>
          </div>
        </div>
      </section>
    </main>
  )
}
