export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'

export default async function ShopProfilePage({ params }) {
  const shop = await prisma.shop.findUnique({
    where: { id: params.shopId },
    include: {
      products: { where: { active: true }, include: { sizes: true }, orderBy: { createdAt: 'desc' } },
      _count: { select: { products: true } },
    },
  })

  if (!shop) notFound()

  return (
    <main>
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <img src={shop.coverUrl ?? `https://picsum.photos/seed/${shop.id}-cover/1200/480`} alt={shop.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/40 to-bg" />
        <Link href={`/browse/${shop.city.toLowerCase()}`} className="absolute top-5 left-5 sm:left-8 flex items-center gap-2 text-primary/80 hover:text-primary font-mono text-[11px] uppercase tracking-wider transition-colors">
          ← {shop.city}
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col sm:flex-row items-start gap-5 -mt-12 mb-8 relative z-10">
          <img src={shop.logoUrl ?? `https://picsum.photos/seed/${shop.id}-logo/200/200`} alt={shop.name}
            className="w-20 h-20 object-cover rounded-full border-2 border-accent bg-surface flex-shrink-0" />
          <div className="flex-1 pt-2 sm:pt-14">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{shop.city}, {shop.country}</span>
                </div>
                <h1 className="font-display font-black text-2xl sm:text-4xl">{shop.name}</h1>
              </div>
              <div className="flex items-center gap-3">
                {shop.instagram && (
                  <a href={`https://instagram.com/${shop.instagram}`} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm py-2 px-4">IG ↗</a>
                )}
              </div>
            </div>
            {shop.bio && <p className="text-muted text-sm mt-4 max-w-2xl leading-relaxed">{shop.bio}</p>}
            <div className="flex flex-wrap gap-2 mt-4">
              {shop.styleTags?.map(s => <span key={s} className="tag active">{s}</span>)}
              <span className="tag">{shop._count.products} items</span>
              <span className="tag">{shop.currency}</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-border mb-8" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
          {shop.products.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </main>
  )
}
