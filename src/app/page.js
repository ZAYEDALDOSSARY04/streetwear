export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ShopCard from '@/components/ShopCard'
import CitySelector from '@/components/CitySelector'

const FEATURED_CITIES = [
  { id: 'bahrain',   name: 'Bahrain',   country: 'Bahrain',      flag: '🇧🇭', cover: 'https://picsum.photos/seed/bahrain-city/800/500'  },
  { id: 'riyadh',   name: 'Riyadh',    country: 'Saudi Arabia', flag: '🇸🇦', cover: 'https://picsum.photos/seed/riyadh-city/800/500'   },
  { id: 'jeddah',   name: 'Jeddah',    country: 'Saudi Arabia', flag: '🇸🇦', cover: 'https://picsum.photos/seed/jeddah-city/800/500'   },
  { id: 'dubai',    name: 'Dubai',     country: 'UAE',          flag: '🇦🇪', cover: 'https://picsum.photos/seed/dubai-city/800/500'    },
  { id: 'tokyo',    name: 'Tokyo',     country: 'Japan',        flag: '🇯🇵', cover: 'https://picsum.photos/seed/tokyo-city/800/500',    comingSoon: true },
  { id: 'nyc',      name: 'New York',  country: 'USA',          flag: '🇺🇸', cover: 'https://picsum.photos/seed/nyc-city/800/500',     comingSoon: true },
  { id: 'london',   name: 'London',    country: 'UK',           flag: '🇬🇧', cover: 'https://picsum.photos/seed/london-city/800/500',  comingSoon: true },
  { id: 'abu-dhabi',name: 'Abu Dhabi', country: 'UAE',          flag: '🇦🇪', cover: 'https://picsum.photos/seed/abudhabi-city/800/500' },
]

async function getShopCounts() {
  const shops = await prisma.shop.groupBy({ by: ['city'], _count: { id: true }, where: { status: 'APPROVED' } })
  return Object.fromEntries(shops.map(s => [s.city.toLowerCase(), s._count.id]))
}

export default async function HomePage() {
  const shopCounts = await getShopCounts()
  const recentShops = await prisma.shop.findMany({
    where: { status: 'APPROVED' },
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden border-b border-border">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent" />
        <span aria-hidden className="absolute select-none pointer-events-none font-display font-black text-white/[0.025] whitespace-nowrap"
          style={{ fontSize: 'clamp(100px,18vw,260px)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', letterSpacing: '0.05em' }}>
          STREETMAP
        </span>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 w-full py-20">
          <p className="section-label mb-6">// discover your city's scene</p>
          <h1 className="font-display font-black text-primary leading-none mb-6"
            style={{ fontSize: 'clamp(52px,9vw,130px)', letterSpacing: '-0.02em', lineHeight: 0.92 }}>
            DISCOVER<br /><span className="text-accent">STREET</span>WEAR<br />BY CITY.
          </h1>
          <p className="text-muted text-lg mb-10 max-w-md">Shop local streetwear stores from your city. Curated, authentic, shipped direct.</p>
          <CitySelector cities={FEATURED_CITIES} shopCounts={shopCounts} />
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="font-mono text-[9px] uppercase tracking-widest">Scroll</span>
          <div className="w-px h-10 bg-muted animate-pulse" />
        </div>
      </section>

      {/* Featured Cities */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
        <p className="section-label mb-2">// scenes on the map</p>
        <h2 className="font-display font-bold text-3xl mb-10">Featured Cities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {FEATURED_CITIES.map(city => {
            const count = shopCounts[city.name.toLowerCase()] ?? 0
            return (
              <Link key={city.id} href={city.comingSoon ? '#' : `/browse/${city.id}`}
                className={`group relative overflow-hidden border ${city.comingSoon ? 'opacity-50 border-border cursor-default' : 'border-border hover:border-accent/60 cursor-pointer'} transition-all duration-200`}>
                <div className="relative h-28 overflow-hidden bg-surface">
                  <img src={city.cover} alt={city.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-bg/50 group-hover:bg-bg/30 transition-colors" />
                  <span className="absolute top-2 left-2 text-xl">{city.flag}</span>
                  {city.comingSoon && <span className="absolute bottom-2 left-2 bg-bg/80 font-mono text-[8px] uppercase tracking-widest text-accent px-2 py-0.5">Soon</span>}
                </div>
                <div className="p-3 bg-surface">
                  <p className="font-display font-bold text-sm group-hover:text-accent transition-colors">{city.name}</p>
                  <div className="flex justify-between mt-0.5">
                    <p className="font-mono text-[10px] text-muted">{city.country}</p>
                    {!city.comingSoon && <p className="font-mono text-[10px] text-muted"><span className="text-primary">{count}</span> shops</p>}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* New shops */}
      {recentShops.length > 0 && (
        <section className="border-t border-border bg-surface py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <p className="section-label mb-2">// new arrivals</p>
            <h2 className="font-display font-bold text-3xl mb-10">Latest Shops</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {recentShops.map(shop => <ShopCard key={shop.id} shop={shop} />)}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="border-t border-border py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <p className="section-label mb-2">// the model</p>
          <h2 className="font-display font-bold text-3xl mb-12">How StreetMap Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Pick a City', body: 'Select your city or detect your location. Every city has its own scene.' },
              { num: '02', title: 'Browse Local Shops', body: 'Discover curated streetwear boutiques with real local inventory.' },
              { num: '03', title: 'Buy Direct', body: '10% of every sale supports the local shop owner directly.' },
            ].map(s => (
              <div key={s.num} className="border-t-2 border-border pt-6 relative">
                <span className="font-mono text-[60px] font-bold text-white/[0.04] absolute -top-2 right-0 leading-none select-none">{s.num}</span>
                <p className="font-mono text-[11px] uppercase tracking-widest text-accent mb-3">{s.num}</p>
                <h3 className="font-display font-bold text-xl mb-2">{s.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display font-bold text-muted text-sm">STREET<span className="text-accent">MAP</span></span>
          <p className="font-mono text-[10px] text-muted">© 2026 StreetMap · 10% commission supports local shops</p>
          <Link href="/register/shop" className="font-mono text-[10px] text-muted hover:text-accent transition-colors uppercase tracking-wider">List your shop →</Link>
        </div>
      </footer>
    </main>
  )
}
