export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ShopCard from '@/components/ShopCard'
import StyleFilter from '@/components/StyleFilter'

const CITY_META = {
  bahrain:   { name: 'Bahrain',   country: 'Bahrain',      flag: '🇧🇭', desc: "The Gulf's raw and unfiltered streetwear scene.", cover: 'https://picsum.photos/seed/bahrain-cover/1200/480' },
  riyadh:    { name: 'Riyadh',    country: 'Saudi Arabia', flag: '🇸🇦', desc: 'The Saudi capital rewrites the streetwear playbook.',  cover: 'https://picsum.photos/seed/riyadh-cover/1200/480'  },
  jeddah:    { name: 'Jeddah',    country: 'Saudi Arabia', flag: '🇸🇦', desc: "Jeddah's coastal energy meets skate and Y2K revival.", cover: 'https://picsum.photos/seed/jeddah-cover/1200/480'  },
  dubai:     { name: 'Dubai',     country: 'UAE',          flag: '🇦🇪', desc: 'Where luxury street meets the desert.',              cover: 'https://picsum.photos/seed/dubai-cover/1200/480'   },
  'abu-dhabi':{ name:'Abu Dhabi', country: 'UAE',          flag: '🇦🇪', desc: "Building its own techwear and vintage identity.",     cover: 'https://picsum.photos/seed/abudhabi-cover/1200/480'},
}

export default async function CityBrowsePage({ params, searchParams }) {
  const meta = CITY_META[params.cityId]
  if (!meta) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><p className="text-5xl mb-4">🗺</p><h1 className="font-display font-bold text-2xl mb-3">City not found</h1><Link href="/" className="btn-ghost inline-block">← Back Home</Link></div>
    </div>
  )

  const styleFilter = searchParams?.style
  const shops = await prisma.shop.findMany({
    where: {
      status: 'APPROVED',
      city: { contains: meta.name, mode: 'insensitive' },
      ...(styleFilter && { styleTags: { has: styleFilter } }),
    },
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const allStyleTags = [...new Set(shops.flatMap(s => s.styleTags))]

  return (
    <main>
      <section className="relative overflow-hidden border-b border-border py-16 sm:py-24">
        <div className="absolute inset-0"><img src={meta.cover} alt="" className="w-full h-full object-cover opacity-10" /><div className="absolute inset-0 bg-bg/80" /></div>
        <span aria-hidden className="absolute select-none pointer-events-none font-display font-black text-white/[0.03] whitespace-nowrap"
          style={{ fontSize: 'clamp(80px,14vw,200px)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', letterSpacing: '0.08em' }}>
          {meta.name.toUpperCase()}
        </span>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-primary font-mono text-[11px] uppercase tracking-wider mb-8 transition-colors">← Home</Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3"><span className="text-4xl">{meta.flag}</span><p className="section-label">{meta.country}</p></div>
              <h1 className="font-display font-black text-primary leading-none" style={{ fontSize: 'clamp(40px,7vw,96px)', letterSpacing: '-0.02em', lineHeight: 0.9 }}>{meta.name.toUpperCase()}</h1>
              <p className="font-display text-accent font-semibold text-xl mt-1">STREETWEAR SCENE</p>
            </div>
            <div className="bg-surface border border-border px-4 py-3 text-right">
              <p className="section-label">Shops on the map</p>
              <p className="font-display font-black text-3xl text-accent">{shops.length}</p>
              <p className="font-mono text-[10px] text-muted max-w-[180px] text-right mt-1">{meta.desc}</p>
            </div>
          </div>
        </div>
      </section>

      <StyleFilter styles={allStyleTags} currentStyle={styleFilter} cityId={params.cityId} />

      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        {shops.length === 0 ? (
          <div className="text-center py-20"><p className="text-4xl mb-4">🔍</p><p className="font-display font-bold text-xl mb-2">No shops found</p><Link href={`/browse/${params.cityId}`} className="btn-ghost mt-4 inline-block">Clear Filters</Link></div>
        ) : (
          <>
            <p className="font-mono text-[11px] text-muted uppercase tracking-wider mb-6">{shops.length} {shops.length === 1 ? 'shop' : 'shops'} in {meta.name}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {shops.map(shop => <ShopCard key={shop.id} shop={shop} />)}
            </div>
          </>
        )}
      </section>

      <section className="border-t border-border bg-surface py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8"><p className="section-label mb-6">// more scenes</p><Link href="/" className="btn-ghost inline-block">← Explore Other Cities</Link></div>
      </section>
    </main>
  )
}
