export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import AddToCartSection from '@/components/AddToCartSection'
import ProductCard from '@/components/ProductCard'

export default async function ProductDetailPage({ params }) {
  const product = await prisma.product.findUnique({
    where: { id: params.productId },
    include: { sizes: true, shop: true },
  })

  if (!product) notFound()

  const related = await prisma.product.findMany({
    where: { shopId: product.shopId, id: { not: product.id }, active: true },
    include: { sizes: true, shop: true },
    take: 4,
  })

  const allImages = product.photos?.length ? product.photos : [`https://picsum.photos/seed/${product.id}/600/720`]

  return (
    <main className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
      <nav className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/browse/${product.shop.city.toLowerCase()}`} className="hover:text-primary transition-colors">{product.shop.city}</Link>
        <span>/</span>
        <Link href={`/shop/${product.shop.id}`} className="hover:text-primary transition-colors">{product.shop.name}</Link>
        <span>/</span>
        <span className="text-primary truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Gallery */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-2 w-16 flex-shrink-0">
            {allImages.slice(0, 4).map((img, i) => (
              <div key={i} className="w-16 h-16 overflow-hidden border border-border">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="flex-1 bg-surface border border-border overflow-hidden">
            <img src={allImages[0]} alt={product.name} className="w-full h-full object-cover aspect-[4/5]" />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <Link href={`/shop/${product.shop.id}`} className="flex items-center gap-2 mb-4 group w-fit">
            <img src={product.shop.logoUrl ?? `https://picsum.photos/seed/${product.shop.id}-logo/200/200`} alt="" className="w-7 h-7 rounded-full object-cover border border-border" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted group-hover:text-accent transition-colors">{product.shop.city} · {product.shop.name}</span>
          </Link>
          {product.styleTags?.[0] && <span className="tag w-fit mb-3">{product.styleTags[0]}</span>}
          <h1 className="font-display font-black text-2xl sm:text-3xl leading-tight mb-3">{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-1">
            <span className="font-display font-black text-3xl text-accent">{product.currency} {product.price}</span>
          </div>
          <p className="font-mono text-[10px] text-muted mb-5">10% of this purchase supports {product.shop.name}</p>
          {product.description && <p className="text-muted text-sm leading-relaxed mb-6">{product.description}</p>}

          <AddToCartSection product={{ ...product, sizes: product.sizes }} />

          <div className="mt-6 border-t border-border pt-5 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-accent mt-0.5">◈</span>
              <div><p className="font-display font-semibold text-sm">Shipping</p><p className="text-muted text-xs mt-0.5">Ships from {product.shop.city} · 3–6 business days</p></div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent mt-0.5">◈</span>
              <div><p className="font-display font-semibold text-sm">Origin Wear Verified</p><p className="text-muted text-xs mt-0.5">Sold by {product.shop.name} · Real local shop</p></div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-border pt-12">
          <div className="flex items-center gap-4 mb-8"><p className="section-label">// more from {product.shop.name}</p><div className="h-px flex-1 bg-border" /></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </main>
  )
}
