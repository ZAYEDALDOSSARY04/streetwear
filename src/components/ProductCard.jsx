import Link from 'next/link'

export default function ProductCard({ product }) {
  const img = product.photos?.[0] ?? product.image ?? `https://picsum.photos/seed/${product.id}/600/720`

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-surface border border-border group-hover:border-accent/40 transition-all duration-200 overflow-hidden">
        <div className="relative aspect-[4/5] overflow-hidden bg-border">
          <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {product.styleTags?.[0] && (
            <span className="absolute top-3 left-3 bg-bg/90 font-mono text-[9px] uppercase tracking-wider text-muted px-2 py-1">{product.styleTags[0]}</span>
          )}
          <span className="absolute bottom-3 left-3 right-3 bg-accent/10 border border-accent/30 text-accent font-mono text-[9px] uppercase tracking-wider px-2 py-1 inline-block">10% supports local shops</span>
        </div>
        <div className="p-3">
          {product.shop && (
            <p className="font-mono text-[10px] text-muted uppercase tracking-wider mb-1">{product.shop.city}</p>
          )}
          <h3 className="font-display font-semibold text-sm leading-tight mb-2 group-hover:text-accent transition-colors line-clamp-2">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-base">{product.currency} {product.price}</span>
            <span className="font-mono text-[10px] text-muted">{product.sizes?.slice(0, 3).map(s => s.label).join(' · ')}{product.sizes?.length > 3 ? ' +' : ''}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
